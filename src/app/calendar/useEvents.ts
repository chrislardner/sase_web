"use client";

import {useEffect, useMemo, useState} from "react";
import type {EventId, EventItem} from "./types";
import {getEventById, loadEvents} from "./eventsStore";

export function useEvents() {
    const [events, setEvents] = useState<EventItem[]>(() => loadEvents());

    useEffect(() => {
        const onStorage = (e: StorageEvent) => {
            if (!e.key || e.key === "sase.calendar.v1") {
                setEvents(loadEvents());
            }
        };
        window.addEventListener("storage", onStorage);
        return () => window.removeEventListener("storage", onStorage);
    }, []);

    return useMemo(() => ({
        events,
        get: (id: EventId) => getEventById(id),
    }), [events]);
}
