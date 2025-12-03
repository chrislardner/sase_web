'use client';

import { useEffect } from 'react';

declare global {
    interface Window {
        __saseHint?: boolean;
        goPuzzle?: () => void;
    }
}

export default function ConsoleMessage(): null {
    useEffect(() => {
        if (typeof window === 'undefined') return;

        if (window.__saseHint) return;
        window.__saseHint = true;

        const title = '%cSASE site';
        const style = 'color:#2563eb;font-weight:600;';
        const hint = '\npsst… window.goPuzzle()';

        console.log(title, style, hint);

        window.goPuzzle = () => {
            window.location.assign('/puzzle');
        };
    }, []);
    return null;
}
