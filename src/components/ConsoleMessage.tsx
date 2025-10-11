'use client';

import { useEffect } from 'react';

declare global {
    interface Window {
        __saseTeased?: boolean;
        goWordle?: () => void;
    }
}

export default function ConsoleMessage(): null {
    useEffect(() => {
        if (typeof window === 'undefined') return;

        if (window.__saseTeased) return;
        window.__saseTeased = true;

        const title = '%cSASE site';
        const style = 'color:#2563eb;font-weight:600;';
        const hint = '\npsst… try typing: window.goWordle()';

        console.log(title, style, hint);

        window.goWordle = () => {
            window.location.assign('/wordle');
        };
    }, []);
    return null;
}
