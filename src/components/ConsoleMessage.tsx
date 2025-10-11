'use client';

import {useEffect} from "react";

export default function ConsoleMessage() {
    useEffect(() => {
        if ((window as any).__saseTeased) return;
        (window as any).__saseTeased = true;
        const msg = [
            '%cSASE site',
            'color:#2563eb;font-weight:600;',
            '\npsst… try typing: window.goWordle()',
        ];
        console.log(msg[0], msg[1], msg[2]);
        (window as any).goWordle = () => { window.location.assign('/wordle'); };
    }, []);
    return null;
}

export class HotKeys {
}