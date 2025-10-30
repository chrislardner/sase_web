"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef } from "react";

type Props = {
    images?: string[];
    current: number;
    onChange: (nextIndex: number) => void;
    title: string;
};

export default function ImageCarousel({ images, current, onChange, title }: Props) {
    const fallback = useMemo(
        () => Array.from({ length: 10 }, () => `https://placehold.co/1600x1000?text=%20`),
        []
    );
    const imgs = images?.length ? images : fallback;

    const thumbsRef = useRef<HTMLDivElement>(null);
    const thumbBtnRefs = useRef<Array<HTMLButtonElement | null>>([]);

    const setThumbRef = useCallback(
        (idx: number) => (el: HTMLButtonElement | null): void => {
            thumbBtnRefs.current[idx] = el;
        },
        []
    );

    useEffect(() => {
        const btn = thumbBtnRefs.current[current];
        btn?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }, [current]);

    const prev = () => onChange((current - 1 + imgs.length) % imgs.length);
    const next = () => onChange((current + 1) % imgs.length);

    return (
        <div className="space-y-3">
            <div className="relative w-full h-52 md:h-64 lg:h-[22rem] rounded-xl overflow-hidden">
                <Image
                    key={current}
                    src={imgs[current]}
                    alt={`${title} image ${current + 1}`}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs px-2 py-0.5 rounded bg-black/50 text-white">
                    {current + 1} / {imgs.length}
                </div>
            </div>

            <div className="relative">
                <button
                    className="btn btn-icon absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/40 text-white hover:bg-black/60"
                    onClick={prev}
                    aria-label="Previous image"
                >
                    ‹
                </button>

                <div
                    ref={thumbsRef}
                    className="flex gap-2 overflow-x-auto px-6 py-1 snap-x snap-mandatory"
                    aria-label={`${title} thumbnails`}
                >
                    {imgs.map((src, i) => (
                        <button
                            key={i}
                            ref={setThumbRef(i)}
                            onClick={() => onChange(i)}
                            className={`relative shrink-0 w-24 h-16 md:w-28 md:h-20 rounded-md overflow-hidden border ${
                                i === current ? "border-white md:border-red-600" : "border-transparent"
                            }`}
                            aria-label={`Image ${i + 1}`}
                        >
                            <Image src={src} alt={`${title} thumbnail ${i + 1}`} fill className="object-cover" />
                        </button>
                    ))}
                </div>

                <button
                    className="btn btn-icon absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/40 text-white hover:bg-black/60"
                    onClick={next}
                    aria-label="Next image"
                >
                    ›
                </button>
            </div>
        </div>
    );
}
