'use client';

import { useEffect } from 'react';

declare global {
    interface Window {
        __saseHint?: boolean;
        goWordle?: () => void;
    }
}

export default function ConsoleMessage(): null {
    useEffect(() => {
        if (typeof window === 'undefined') return;

        if (window.__saseHint) return;
        window.__saseHint = true;

        const title = '%cSASE site';
        const style = 'color:#2563eb;font-weight:600;';
        const hint = '\npsst… window.goWordle()';

        console.log(title, style, hint);

        window.goWordle = () => {
            window.location.assign('/wordle');
        };
    }, []);
    return null;
}
