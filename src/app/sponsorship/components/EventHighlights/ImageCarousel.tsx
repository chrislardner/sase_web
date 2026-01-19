"use client";

import Image from "next/image";
import {useCallback, useEffect, useRef} from "react";

const PLACEHOLDER_IMAGE = "https://placehold.co/1600x1000/1a1a2e/ffffff?text=SASE+RHIT";

type Props = {
    images: string[];
    current: number;
    onChangeAction: (nextIndex: number) => void;
    title: string;
};

export default function ImageCarousel({images, current, onChangeAction, title}: Props) {
    const validImages = images?.filter((img) => img && img.trim() !== "") ?? [];
    const imgs = validImages.length > 0 ? validImages : [PLACEHOLDER_IMAGE];

    const safeIndex = Math.min(Math.max(0, current), imgs.length - 1);
    const currentSrc = imgs[safeIndex] || PLACEHOLDER_IMAGE;

    const thumbsRef = useRef<HTMLDivElement>(null);
    const thumbBtnRefs = useRef<Array<HTMLButtonElement | null>>([]);

    const setThumbRef = useCallback(
        (idx: number) => (el: HTMLButtonElement | null): void => {
            thumbBtnRefs.current[idx] = el;
        },
        []
    );

    useEffect(() => {
        const btn = thumbBtnRefs.current[safeIndex];
        btn?.scrollIntoView({behavior: "smooth", block: "nearest", inline: "center"});
    }, [safeIndex]);

    const prev = () => onChangeAction((safeIndex - 1 + imgs.length) % imgs.length);
    const next = () => onChangeAction((safeIndex + 1) % imgs.length);

    const showNav = imgs.length > 1;

    return (
        <div className="space-y-3">
            <div className="relative w-full h-52 md:h-64 lg:h-[22rem] rounded-xl overflow-hidden">
                <Image
                    key={`${safeIndex}-${currentSrc}`}
                    src={currentSrc}
                    alt={`${title} image ${safeIndex + 1}`}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                />
                {showNav && (
                    <div
                        className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs px-2 py-0.5 rounded bg-black/50 text-white">
                        {safeIndex + 1} / {imgs.length}
                    </div>
                )}
            </div>

            {showNav && (
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
                        className="flex gap-2 overflow-x-auto px-6 py-1 snap-x snap-mandatory scrollbar-hide"
                        aria-label={`${title} thumbnails`}
                    >
                        {imgs.map((src, i) => (
                            <button
                                key={`thumb-${i}-${src}`}
                                ref={setThumbRef(i)}
                                onClick={() => onChangeAction(i)}
                                className={`relative shrink-0 w-24 h-16 md:w-28 md:h-20 rounded-md overflow-hidden border-2 transition-all ${
                                    i === safeIndex
                                        ? "border-white ring-2 ring-red-500 md:border-red-600"
                                        : "border-transparent hover:border-white/50"
                                }`}
                                aria-label={`Image ${i + 1}`}
                                aria-current={i === safeIndex ? "true" : undefined}
                            >
                                <Image
                                    src={src || PLACEHOLDER_IMAGE}
                                    alt={`${title} thumbnail ${i + 1}`}
                                    fill
                                    className="object-cover"
                                    sizes="112px"
                                />
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
            )}
        </div>
    );
}