"use client";

import Image from "next/image";
import type { EventItem } from "./EventsData";
import { placeholder } from "./EventsData";

export default function EventList({
                                      events,
                                      onOpen,
                                  }: {
    events: EventItem[];
    onOpen: (index: number) => void;
}) {
    return (
        <div className="space-y-8">
            {events.map((ev, i) => (
                <article
                    key={ev.id}
                    className="grid grid-cols-1 md:grid-cols-[240px_1fr_auto] items-center gap-4 p-4 rounded-lg shadow-lg bg-white/80 dark:bg-neutral-900/70"
                >
                    <div className="relative w-full md:w-[240px] h-40 md:h-32 overflow-hidden rounded-md">
                        <Image src={placeholder.thumb()} alt={`${ev.title} thumbnail`} fill className="object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-tr from-black/5 via-transparent to-black/10" />
                    </div>

                    <div>
                        <h3 className="text-lg md:text-xl font-semibold">{ev.title}</h3>
                        <p className="text-sm md:text-base text-neutral-700 dark:text-neutral-200 leading-relaxed line-clamp-2">
                            {ev.description}
                        </p>
                    </div>

                    <div className="flex md:justify-end">
                        <button
                            onClick={() => onOpen(i)}
                            className="btn border bg-transparent hover:bg-black/5 text-black border-black/70 dark:text-white dark:border-white/80 dark:hover:bg-white/10"
                            aria-haspopup="dialog"
                            aria-controls={`event-overlay-${ev.id}`}
                        >
                            View
                        </button>
                    </div>
                </article>
            ))}
        </div>
    );
}
