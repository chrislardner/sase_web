"use client";

import {useCallback, useEffect, useRef, useState} from "react";
import ImageCarousel from "./ImageCarousel";
import type {EventItem} from "./EventsData";
import {getEventGallery} from "@/app/lib/images";

type Props = {
    event: EventItem;
    index: number;
    onClose: () => void;
    onPrevEvent: () => void;
    onNextEvent: () => void;
};

export default function EventOverlay({event, index, onClose, onPrevEvent, onNextEvent}: Props) {
    const dialogRef = useRef<HTMLDivElement>(null);
    const closeRef = useRef<HTMLButtonElement>(null);

    const images = getEventGallery(event.id);
    const [imgIdx, setImgIdx] = useState(0);

    useEffect(() => setImgIdx(0), [index]);
    useEffect(() => {
        closeRef.current?.focus();
    }, []);

    const onKey = useCallback((e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
        if (e.key === "ArrowLeft") onPrevEvent();
        if (e.key === "ArrowRight") onNextEvent();
    }, [onClose, onPrevEvent, onNextEvent]);

    useEffect(() => {
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [onKey]);

    const onBackdropMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        const node = dialogRef.current;
        if (!node) return;
        const target = e.target as Node;
        if (!node.contains(target)) onClose();
    };

    const outlineBtn =
        "btn border bg-transparent hover:bg-black/5 text-black border-black/70 " +
        "dark:text-white dark:border-white/80 dark:hover:bg-white/10";

    const outlineIcon =
        "btn btn-icon border bg-black/40 text-white border-white/80 hover:bg-black/60 " +
        "dark:bg-black/40 dark:text-white dark:border-white/80";

    return (
        <div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-labelledby={`event-title-${event.id}`}
            onMouseDown={onBackdropMouseDown}
        >
            <div className="min-h-full flex items-start md:items-center justify-center p-4 md:p-6">
                <div
                    ref={dialogRef}
                    className="relative bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl p-4 md:p-6 w-full max-w-6xl"
                >
                    <button
                        ref={closeRef}
                        className={`${outlineIcon} absolute top-3 right-3`}
                        onClick={onClose}
                        aria-label="Close overlay"
                        title="Close"
                    >
                        ✕
                    </button>

                    <h3 id={`event-title-${event.id}`} className="text-xl md:text-2xl font-bold mb-4 text-center">
                        {event.title}
                    </h3>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                        <ImageCarousel
                            title={event.title}
                            images={images}
                            current={imgIdx}
                            onChange={setImgIdx}
                        />

                        <div className="max-h-[60vh] lg:max-h-[24rem] overflow-y-auto pr-1">
                            <p className="text-neutral-700 dark:text-neutral-200 leading-relaxed whitespace-pre-line">
                                {event.description}
                            </p>
                        </div>
                    </div>

                    <div
                        className="mt-6 pt-4 border-t border-black/10 dark:border-white/10 flex items-center justify-between">
                        <button className={outlineBtn} onClick={onPrevEvent} aria-label="Previous event">
                            ← Prev Event
                        </button>
                        <button className={outlineBtn} onClick={onNextEvent} aria-label="Next event">
                            Next Event →
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}