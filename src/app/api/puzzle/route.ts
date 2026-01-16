import {NextRequest, NextResponse} from 'next/server';
import 'server-only';

import {
    answerForPeriod,
    currentPeriodIndex,
    evalGuess,
    GuessRequest,
    GuessResponse,
    hmac,
    makePowChallenge,
    maxGuesses,
    Meta,
    normalizeGuess,
    PERIOD_DAYS,
    periodLenFor,
    puzzleIdForPeriod,
    toB64Url,
    verifyPow,
} from '@/server/puzzle';
import {cookies as headerCookies} from 'next/headers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;


const COOKIE_NAME = 'swp';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 90; // 90 days

type CookiePayload = { pid: string; c: number; t: number }; // puzzleId, count, timestamp
function sign(v: string) {
    return toB64Url(hmac('cookie:' + v));
}

function encodeCookie(p: CookiePayload) {
    const body = toB64Url(Buffer.from(JSON.stringify(p)));
    const sig = sign(body);
    return `${body}.${sig}`;
}

function decodeCookie(str?: string | null): CookiePayload | null {
    if (!str) return null;
    const [body, sig] = str.split('.');
    if (!body || !sig) return null;
    if (sign(body) !== sig) return null;
    try {
        return JSON.parse(Buffer.from(body.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8'));
    } catch {
        return null;
    }
}

function nextPowBits(base: number, count: number): number {
    if (count >= 20) return base + 4;
    if (count >= 12) return base + 2;
    if (count >= 8) return base + 1;
    return base;
}

export async function GET() {
    const {index, label, expiresAt} = currentPeriodIndex();
    const pid = puzzleIdForPeriod(index);
    const len = periodLenFor(index);

    const c = await headerCookies();
    const raw = c.get(COOKIE_NAME)?.value;
    const parsed = decodeCookie(raw);
    const count = parsed?.pid === pid ? parsed.c : 0;

    const baseBits = Number(process.env.SASE_PUZZLE_POW_BITS || '15');
    const pow = makePowChallenge(pid, nextPowBits(baseBits, count));

    const meta: Meta = {
        puzzleId: pid,
        len,
        periodLabel: label,
        expiresAt,
        maxGuesses: maxGuesses(),
        periodDays: PERIOD_DAYS,
        pow,
    };
    return NextResponse.json(meta, {headers: {'Cache-Control': 'no-store'}});
}

export async function POST(req: NextRequest) {
    let payload: GuessRequest;
    try {
        payload = await req.json();
    } catch {
        return NextResponse.json<GuessResponse>({ok: false, error: 'Bad JSON'}, {status: 400});
    }

    const {puzzleId, guess, pow} = payload || ({} as GuessRequest);
    if (!puzzleId || !pow) {
        return NextResponse.json<GuessResponse>({ok: false, error: 'Missing fields'}, {status: 400});
    }

    const {index: cur} = currentPeriodIndex();
    const idx = [cur - 1, cur, cur + 1].find(k => puzzleId === puzzleIdForPeriod(k));
    if (idx == null) {
        return NextResponse.json<GuessResponse>({ok: false, error: 'Unknown puzzle'}, {status: 400});
    }

    const expectedLen = periodLenFor(idx);

    const c = await headerCookies();
    const raw = c.get(COOKIE_NAME)?.value;
    const parsed = decodeCookie(raw);
    const priorCount = parsed?.pid === puzzleId ? parsed.c : 0;

    const baseBits = Number(process.env.SASE_PUZZLE_POW_BITS || '15');
    const requiredBits = nextPowBits(baseBits, priorCount);

    if (!verifyPow(puzzleId, requiredBits, pow.prefix, pow.nonce, pow.sig)) {
        return NextResponse.json<GuessResponse>({ok: false, error: 'Invalid proof-of-work'}, {status: 429});
    }

    const g = normalizeGuess(guess, expectedLen);
    if (!g) {
        return NextResponse.json<GuessResponse>({
            ok: false,
            error: `Guess must be ${expectedLen} letters`
        }, {status: 400});
    }

    const answer = answerForPeriod(idx);
    const row = evalGuess(answer, g);
    const win = g === answer;

    const nextCount = Math.min(priorCount + 1, 999);
    const nextCookie = encodeCookie({pid: puzzleId, c: nextCount, t: Date.now()});

    const resp = NextResponse.json<GuessResponse>({
        ok: true,
        result: row,
        win,
        remaining: maxGuesses(),
    }, {headers: {'Cache-Control': 'no-store'}});

    resp.cookies.set(COOKIE_NAME, nextCookie, {
        httpOnly: true, sameSite: 'lax', secure: true, maxAge: COOKIE_MAX_AGE, path: '/',
    });

    return resp;
}
