"use client";

import {ReactNode, useId} from "react";

type Props = {
    label: string;
    children: ReactNode;
    side?: "top" | "bottom" | "left" | "right";
};

export function Tooltip({label, children, side = "top"}: Props) {
    const id = useId();

    const pos =
        side === "top"
            ? "bottom-full left-1/2 -translate-x-1/2 -translate-y-2"
            : side === "bottom"
                ? "top-full left-1/2 -translate-x-1/2 translate-y-2"
                : side === "left"
                    ? "right-full top-1/2 -translate-y-1/2 -translate-x-2"
                    : "left-full top-1/2 -translate-y-1/2 translate-x-2";

    const arrowPos =
        side === "top"
            ? "top-full left-1/2 -translate-x-1/2"
            : side === "bottom"
                ? "bottom-full left-1/2 -translate-x-1/2"
                : side === "left"
                    ? "left-full top-1/2 -translate-y-1/2"
                    : "right-full top-1/2 -translate-y-1/2";

    return (
        <span className="relative inline-flex">
            <span aria-describedby={id} className="peer inline-flex focus:outline-none">
        {children}
      </span>
            <span
                id={id}
                role="tooltip"
                className={`pointer-events-none absolute z-50 select-none whitespace-nowrap rounded-md px-2 py-1 text-xs shadow-lg
                    bg-[color:var(--fg)] text-[color:var(--bg-page)]
                    opacity-0 translate-y-1
                    transition duration-150 ease-out
                    peer-hover:opacity-100 peer-focus:opacity-100
                    peer-hover:translate-y-0 peer-focus:translate-y-0
                    ${pos}`}
            >
        {label}
                <span
                    aria-hidden
                    className={`absolute h-2 w-2 rotate-45 bg-[color:var(--fg)] ${arrowPos}`}
                />
      </span>
    </span>
    );
}
