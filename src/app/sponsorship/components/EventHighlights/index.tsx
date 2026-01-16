"use client";

import {useCallback, useEffect, useState} from "react";
import {EVENTS} from "./EventsData";
import EventList from "./EventList";
import EventOverlay from "./EventOverlay";

export default function EventHighlights() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    useEffect(() => {
        document.body.style.overflow = openIndex !== null ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [openIndex]);

    const open = useCallback((i: number) => setOpenIndex(i), []);
    const close = useCallback(() => setOpenIndex(null), []);
    const nextEvent = useCallback(() => setOpenIndex((i) => (i! + 1) % EVENTS.length), []);
    const prevEvent = useCallback(() => setOpenIndex((i) => (i! - 1 + EVENTS.length) % EVENTS.length), []);

    return (
        <section id="events" className="mb-12 fade-in">
            <h2 className="text-3xl font-bold text-center mb-8">Event Highlights</h2>
            <EventList events={EVENTS} onOpen={open}/>

            {openIndex !== null && (
                <EventOverlay
                    event={EVENTS[openIndex]}
                    index={openIndex}
                    onClose={close}
                    onNextEvent={nextEvent}
                    onPrevEvent={prevEvent}
                />
            )}
        </section>
    );
}
