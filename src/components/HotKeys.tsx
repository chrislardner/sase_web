'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const DEST_PATH = '/puzzle';
const COUNTDOWN_SECONDS = 3 as const;

const SEQ = [
    'ArrowUp','ArrowUp','ArrowDown','ArrowDown',
    'ArrowLeft','ArrowRight','ArrowLeft','ArrowRight',
    'b','a',
] as const;

export default function HotKeys() {
    const router = useRouter();

    const [visible, setVisible] = useState(false);
    const [seconds, setSeconds] = useState<number>(COUNTDOWN_SECONDS);
    const [armed, setArmed] = useState(false);
    const [shouldNav, setShouldNav] = useState(false);

    const timerRef = useRef<number | null>(null);
    const focusBtnRef = useRef<HTMLButtonElement | null>(null);

    const clearIntervalIfAny = useCallback(() => {
        if (timerRef.current != null) {
            window.clearInterval(timerRef.current);
            timerRef.current = null;
        }
    }, []);

    const resetState = useCallback(() => {
        clearIntervalIfAny();
        setVisible(false);
        setArmed(false);
        setSeconds(COUNTDOWN_SECONDS);
    }, [clearIntervalIfAny]);

    const primeModal = useCallback(() => {
        setArmed(true);
        setSeconds(COUNTDOWN_SECONDS);
        setVisible(true);
    }, []);

    const navigateNow = useCallback(() => {
        resetState();
        queueMicrotask(() => router.push(DEST_PATH));
    }, [resetState, router]);

    useEffect(() => {
        let i = 0;
        const onKey = (e: KeyboardEvent) => {
            if (armed) return;
            if (e.altKey || e.ctrlKey || e.metaKey) return;

            const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
            const expected = SEQ[i];

            if (k === expected) {
                i++;
                if (i === SEQ.length) {
                    i = 0;
                    primeModal();
                }
                return;
            }
            i = (k === SEQ[0]) ? 1 : 0;
        };

        window.addEventListener('keydown', onKey, true);
        return () => window.removeEventListener('keydown', onKey, true);
    }, [armed, primeModal]);

    useEffect(() => {
        if (!visible) return;

        queueMicrotask(() => focusBtnRef.current?.focus());

        try { router.prefetch(DEST_PATH); } catch {}

        timerRef.current = window.setInterval(() => {
            setSeconds((s) => (s > 0 ? s - 1 : 0));
        }, 1000);

        const onEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') resetState(); };
        window.addEventListener('keydown', onEsc, true);

        return () => {
            window.removeEventListener('keydown', onEsc, true);
            clearIntervalIfAny();
        };
    }, [visible, router, resetState, clearIntervalIfAny]);

    useEffect(() => {
        if (visible && seconds === 0) {
            setShouldNav(true);
        }
    }, [visible, seconds]);

    useEffect(() => {
        if (shouldNav) {
            setShouldNav(false);
            navigateNow();
        }
    }, [shouldNav, navigateNow]);

    function handleCancel() { resetState(); }
    function handleLaunchNow() { navigateNow(); }

    if (!visible) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            role="dialog" aria-modal="true" aria-labelledby="konami-title" aria-describedby="konami-desc"
        >
            <button
                className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={handleCancel}
                aria-label="Close"
            />
            <div
                className="relative mx-4 max-w-sm w-full rounded-lg border border-neutral-700 bg-neutral-900 text-neutral-100 shadow-xl"
            >
                <div className="p-4">
                    <h2 id="konami-title" className="text-lg font-semibold">Secret unlocked</h2>
                    <p id="konami-desc" className="mt-1 text-sm text-neutral-300">
                        Launch SASE Wordle in <span className="font-mono">{seconds}s</span>…
                    </p>
                    <div className="mt-4 flex items-center gap-2">
                        <button
                            ref={focusBtnRef}
                            onClick={handleLaunchNow}
                            className="px-3 py-2 rounded bg-blue-600 text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            Launch now
                        </button>
                        <button
                            onClick={handleCancel}
                            className="px-3 py-2 rounded border border-neutral-700 hover:bg-neutral-800"
                        >
                            Cancel
                        </button>
                        <span className="ml-auto text-xs text-neutral-400">Press Esc to cancel</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
