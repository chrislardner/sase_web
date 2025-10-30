'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {Meta, Row, Tile} from "@/server/wordle";


async function fetchMeta(): Promise<Meta> {
    const res = await fetch('/api/wordle', { cache: 'no-store' });
    if (!res.ok) throw new Error('meta fetch failed');
    return res.json();
}
function hex(b: ArrayBuffer) { return [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, '0')).join(''); }
async function sha256(s: string) { return hex(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s))); }

const KEYS_ROW1 = 'qwertyuiop'.split('');
const KEYS_ROW2 = 'asdfghjkl'.split('');
const KEYS_ROW3 = 'zxcvbnm'.split('');
type KeyShade = 'correct'|'present'|'absent'|undefined;
function mergeShade(prev: KeyShade, next: KeyShade): KeyShade {
    const rank = { correct: 3, present: 2, absent: 1, undefined: 0 } as const;
    return (rank[next ?? 'undefined'] > rank[prev ?? 'undefined']) ? next : prev;
}

export default function WordleWeekly() {
    const [meta, setMeta] = useState<Meta | null>(null);
    const [rows, setRows] = useState<Row[]>([]);
    const [current, setCurrent] = useState('');
    const [status, setStatus] = useState('');
    const [busy, setBusy] = useState(false);
    const [won, setWon] = useState(false);
    const [keyShades, setKeyShades] = useState<Record<string, KeyShade>>({});
    const [countdown, setCountdown] = useState<string>('--:--:--');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        (async () => {
            const m = await fetchMeta();
            setMeta(m);

            const k = `sase-wordle:v1:${m.puzzleId}`;
            const saved = localStorage.getItem(k);
            if (saved) {
                try {
                    const parsed = JSON.parse(saved) as { rows: Row[]; won: boolean };
                    if (Array.isArray(parsed.rows)) {
                        setRows(parsed.rows);
                        setWon(Boolean(parsed.won));
                        const shades: Record<string, KeyShade> = {};
                        parsed.rows.forEach(r => {
                            r.guess.split('').forEach((ch, i) => {
                                shades[ch] = mergeShade(shades[ch], r.result[i]);
                            });
                        });
                        setKeyShades(shades);
                    }
                } catch { /* ignore */ }
            }

            setStatus(`Weekly puzzle • ${m.periodLabel} • ${m.len} letters`);
            inputRef.current?.focus();
        })().catch(e => setStatus(String(e)));
    }, []);

    useEffect(() => {
        if (!meta) return;
        const id = setInterval(() => {
            const ms = Math.max(0, meta.expiresAt - Date.now());
            const s = Math.floor(ms / 1000);
            const hh = Math.floor(s / 3600);
            const mm = Math.floor((s % 3600) / 60);
            const ss = s % 60;
            setCountdown(`${String(hh).padStart(2,'0')}:${String(mm).padStart(2,'0')}:${String(ss).padStart(2,'0')}`);
        }, 1000);
        return () => clearInterval(id);
    }, [meta]);

    useEffect(() => {
        if (!meta) return;
        const k = `sase-wordle:v1:${meta.puzzleId}`;
        localStorage.setItem(k, JSON.stringify({ rows, won }));
    }, [rows, won, meta]);

    const attemptsLeft = useMemo(
        () => (meta ? Math.max(0, meta.maxGuesses - rows.length) : 0),
        [meta, rows.length]
    );
    const inputDisabled = busy || won || attemptsLeft <= 0;

    async function submitGuess(guessRaw?: string) {
        if (!meta || inputDisabled) return;

        const cleaned = (guessRaw ?? current).toLowerCase().replace(/[^a-z]/g, '');
        if (cleaned.length !== meta.len) {
            setStatus(`Guess must be ${meta.len} letters`);
            return;
        }

        setBusy(true);
        try {
            const { bits, prefix, sig } = meta.pow;
            let nonce = 0;
            while (true) {
                const h = await sha256(prefix + String(nonce));
                const lead = parseInt(h.slice(0, 5), 16);
                if ((lead >>> (20 - bits)) === 0) break;
                nonce++;
            }

            const res = await fetch('/api/wordle', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                cache: 'no-store',
                body: JSON.stringify({
                    puzzleId: meta.puzzleId,
                    guess: cleaned,
                    pow: { bits, prefix, nonce: String(nonce), sig },
                }),
            });

            const data = await res.json();
            if (!data.ok) {
                setStatus(data.error || 'Error');
                return;
            }

            const result: Tile[] = data.result;
            const newRow: Row = { guess: cleaned, result };
            setRows(r => [...r, newRow]);

            setKeyShades(prev => {
                const next = { ...prev };
                cleaned.split('').forEach((ch, i) => { next[ch] = mergeShade(next[ch], result[i]); });
                return next;
            });

            if (data.win) {
                setWon(true);
                setStatus('Solved!');
            } else {
                setStatus(`Attempts: ${rows.length + 1}/${meta.maxGuesses}`);
            }

            setCurrent('');
            inputRef.current?.focus();
        } finally {
            setBusy(false);
        }
    }

    function handleKey(ch: string) {
        if (!meta || inputDisabled) return;
        if (ch === 'enter') { submitGuess(); return; }
        if (ch === 'back') { setCurrent(s => s.slice(0, -1)); return; }
        if (/^[a-z]$/.test(ch) && current.length < (meta?.len ?? 0)) {
            setCurrent(s => s + ch);
        }
    }

    async function shareResult() {
        if (!meta || rows.length === 0) return;
        const header = `SASE Wordle (${meta.len}) • ${meta.periodLabel}`;
        const attempts = won ? rows.length : 'X';
        const grid = rows.map(r => r.result.map(t => t === 'correct' ? '🟩' : t === 'present' ? '🟨' : '⬛').join('')).join('\n');
        const text = `${header}\n${attempts}/${meta.maxGuesses}\n\n${grid}`;
        try {
            await navigator.clipboard.writeText(text);
            setStatus('Copied result to clipboard!');
        } catch {
            setStatus('Could not copy to clipboard.');
        }
    }

    return (
        <main className="mx-auto max-w-md px-4 py-8">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">SASE Wordle — Weekly</h1>
                    <p className="text-xs text-neutral-500">
                        {meta ? `Length: ${meta.len} • Period: ${meta.periodLabel}` : 'Loading…'}
                    </p>
                </div>
                <div className="text-right">
                    <div className="text-xs text-neutral-500">resets in</div>
                    <div className="font-mono text-sm">{countdown}</div>
                </div>
            </header>

            <p className="mt-2 text-sm text-neutral-400">{status}</p>

            {meta && (
                <div className="mt-4 space-y-1">
                    {rows.map((r, i) => (
                        <div
                            key={i}
                            className="grid gap-1"
                            style={{ gridTemplateColumns: `repeat(${meta.len}, minmax(2.2rem, 2.4rem))` }}
                        >
                            {r.guess.split('').map((ch, j) => {
                                const t = r.result[j];
                                const cls =
                                    t === 'correct' ? 'bg-green-600 text-white border-green-700' :
                                        t === 'present' ? 'bg-yellow-500 text-white border-yellow-600' :
                                            'bg-neutral-800 text-white/90 border-neutral-700';
                                return (
                                    <div key={j} className={`aspect-square grid place-items-center rounded-md text-base font-semibold border ${cls}`}>
                                        {ch.toUpperCase()}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                    <div
                        className="grid gap-1"
                        style={{ gridTemplateColumns: `repeat(${meta.len}, minmax(2.2rem, 2.4rem))` }}
                    >
                        {Array.from({ length: meta.len }).map((_, idx) => (
                            <div
                                key={idx}
                                className="aspect-square grid place-items-center rounded-md text-base font-semibold border border-neutral-700 bg-neutral-900 text-neutral-300"
                            >
                                {(current[idx] ?? '').toUpperCase()}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="mt-3 flex gap-2">
                <input
                    ref={inputRef}
                    value={current}
                    onChange={e => setCurrent(e.target.value.replace(/[^a-z]/gi, '').slice(0, meta?.len ?? 0))}
                    placeholder={meta ? `${meta.len}-letter guess` : 'Loading...'}
                    className="border rounded px-3 py-2 flex-1 bg-white dark:bg-neutral-900 disabled:opacity-60"
                    maxLength={meta?.len ?? 20}
                    disabled={inputDisabled}
                    onKeyDown={e => {
                        if (e.key === 'Enter') submitGuess();
                        if (e.key === 'Backspace') handleKey('back');
                    }}
                    aria-label="Enter your guess"
                />
                <button
                    onClick={() => submitGuess()}
                    disabled={inputDisabled}
                    className="px-4 py-2 rounded bg-blue-600 text-white font-medium disabled:opacity-60"
                >
                    Guess
                </button>
                <button onClick={shareResult} className="px-3 py-2 rounded border text-sm">Share</button>
            </div>

            <div className="mt-4 select-none">
                {[KEYS_ROW1, KEYS_ROW2, KEYS_ROW3].map((row, ri) => (
                    <div key={ri} className="flex justify-center gap-1 mb-1">
                        {ri === 2 && <Key label="Enter" wide onClick={() => handleKey('enter')} />}
                        {row.map(k => (
                            <Key key={k} label={k.toUpperCase()} shade={keyShades[k]} onClick={() => handleKey(k)} />
                        ))}
                        {ri === 2 && <Key label="⌫" wide onClick={() => handleKey('back')} />}
                    </div>
                ))}
            </div>

            <footer className="mt-4 text-xs text-neutral-500">
                {meta && (
                    <>
                        <div>Attempts left: {attemptsLeft}</div>
                        <div>
                            Resets:{' '}
                            {new Date(meta.expiresAt).toLocaleString('en-US', {
                                timeZone: 'America/Chicago', hour12: false,
                            })}{' '}
                            (America/Chicago)
                        </div>
                        <div>Period: {meta.periodDays} day(s) • change via <code>SASE_WORDLE_PERIOD_DAYS</code></div>
                    </>
                )}
            </footer>
        </main>
    );
}

function Key({
                 label, onClick, shade, wide,
             }:{
    label: string; onClick: () => void; shade?: 'correct'|'present'|'absent'; wide?: boolean;
}) {
    const base = 'px-3 py-2 rounded text-sm font-medium border transition active:opacity-70';
    const cls =
        shade === 'correct' ? 'bg-green-600 text-white border-green-700' :
            shade === 'present' ? 'bg-yellow-500 text-white border-yellow-600' :
                shade === 'absent'  ? 'bg-neutral-800 text-white/90 border-neutral-700' :
                    'bg-neutral-900 text-neutral-200 border-neutral-700';
    return (
        <button className={`${base} ${cls} ${wide ? 'min-w-[3.8rem]' : 'min-w-[2rem]'}`} onClick={onClick} aria-label={label}>
            {label}
        </button>
    );
}
