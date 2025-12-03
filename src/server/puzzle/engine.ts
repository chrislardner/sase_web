import 'server-only';
import crypto from 'crypto';
import { getAnswersForLen } from './secureBank';
import type { Tile } from './types';

const TZ = process.env.SASE_PUZZLE_TZ || 'America/Chicago';
const SECRET = process.env.SASE_PUZZLE_SECRET || ''; // 32+ bytes (raw or base64)
const MAX_GUESSES = Number(process.env.SASE_PUZZLE_MAX_GUESSES || '6');
const MIN_LEN = Number(process.env.SASE_PUZZLE_MIN_LEN || '4');
const MAX_LEN = Number(process.env.SASE_PUZZLE_MAX_LEN || '10');

export const PERIOD_DAYS = Number(process.env.SASE_PUZZLE_PERIOD_DAYS || '7');

function nowInTZ(): Date {
    const s = new Date().toLocaleString('en-US', { timeZone: TZ });
    return new Date(s);
}
function startOfDay(d: Date): Date {
    const nd = new Date(d);
    nd.setHours(0, 0, 0, 0);
    return nd;
}
const ANCHOR = new Date('2025-08-25T00:00:00');

export function currentPeriodIndex(): {
    index: number; start: Date; end: Date; label: string; expiresAt: number;
} {
    const now = startOfDay(nowInTZ());
    const anchor = startOfDay(ANCHOR);
    const diffDays = Math.floor((now.getTime() - anchor.getTime()) / 86_400_000);
    const index = Math.floor(diffDays / PERIOD_DAYS);
    const start = new Date(anchor.getTime() + index * PERIOD_DAYS * 86_400_000);
    const end = new Date(start.getTime() + PERIOD_DAYS * 86_400_000);
    const label = PERIOD_DAYS === 7
        ? `${start.toLocaleDateString()} → ${end.toLocaleDateString()}`
        : `${start.toLocaleDateString()} (+${PERIOD_DAYS}d)`;
    return { index, start, end, label, expiresAt: end.getTime() };
}

export function hmac(input: string | Buffer, key = SECRET): Buffer {
    const k = key && /^[A-Za-z0-9+/=]+$/.test(key) ? Buffer.from(key, 'base64') : Buffer.from(key);
    return crypto.createHmac('sha256', k).update(input).digest();
}
export function toB64Url(buf: Buffer): string {
    return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function digestToIndex(digest: Buffer, mod: number): number {
    let acc = 0x811c9dc5 >>> 0;
    for (const b of digest) {
        acc ^= b;
        acc = Math.imul(acc, 0x01000193) >>> 0; // * 16777619
    }
    return mod > 0 ? (acc % mod) : 0;
}

export function puzzleIdForPeriod(periodIndex: number): string {
    return toB64Url(hmac(`period:${PERIOD_DAYS}:${periodIndex}`));
}
export function periodLenFor(periodIndex: number): number {
    const lengths: number[] = [];
    for (let l = MIN_LEN; l <= MAX_LEN; l++) {
        const bank = getAnswersForLen(l);
        if (bank && bank.length > 0) lengths.push(l);
    }
    if (!lengths.length) throw new Error('No answer banks available');
    const d = hmac(`lenpick:${PERIOD_DAYS}:${periodIndex}`);
    return lengths[digestToIndex(d, lengths.length)];
}
export function answerForPeriod(periodIndex: number): string {
    const len = periodLenFor(periodIndex);
    const bank = getAnswersForLen(len);
    const d = hmac(`pick:${PERIOD_DAYS}:${periodIndex}:${len}`);
    const idx = digestToIndex(d, bank.length);
    return bank[idx];
}

export function evalGuess(answer: string, guess: string): Tile[] {
    const a = answer.toLowerCase();
    const g = guess.toLowerCase();
    const n = a.length;

    const out: Tile[] = Array(n).fill('absent');
    const remain: Record<string, number> = {};

    for (let i = 0; i < n; i++) {
        if (g[i] === a[i]) {
            out[i] = 'correct';
        } else {
            const ch = a[i];
            remain[ch] = (remain[ch] ?? 0) + 1;
        }
    }

    for (let i = 0; i < n; i++) {
        if (out[i] === 'correct') continue;
        const ch = g[i];
        if ((remain[ch] ?? 0) > 0) {
            out[i] = 'present';
            remain[ch] = remain[ch] - 1;
        }
    }

    return out;
}

export function normalizeGuess(guess: string, expectedLen: number): string | null {
    const g = (guess || '').toLowerCase().replace(/[^a-z]/g, '');
    return g.length === expectedLen ? g : null;
}

export function maxGuesses(): number {
    return MAX_GUESSES;
}

export function makePowChallenge(puzzleId: string, bits = Number(process.env.SASE_PUZZLE_POW_BITS || '15')) {
    const prefix = toB64Url(crypto.randomBytes(16));
    const sig = toB64Url(hmac(`pow:${puzzleId}:${bits}:${prefix}`));
    return { bits, prefix, sig };
}
export function verifyPow(puzzleId: string, bits: number, prefix: string, nonce: string, sig: string): boolean {
    const expected = toB64Url(hmac(`pow:${puzzleId}:${bits}:${prefix}`));
    if (expected !== sig) return false;
    const hash = crypto.createHash('sha256').update(prefix + nonce).digest();

    let zeros = 0;
    for (const byte of hash) {
        if (byte === 0) { zeros += 8; continue; }
        let b = byte;
        while ((b & 0x80) === 0) { zeros++; b <<= 1; }
        break;
    }
    return zeros >= bits;
}
