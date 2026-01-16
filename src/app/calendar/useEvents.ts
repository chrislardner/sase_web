"use client";

import {useEffect, useMemo, useState} from "react";
import type {AcademicYear, EventId, EventItem, Quarter} from "./types";
import {getEventById, getEventsByQuarter, loadEvents} from "./eventsStore";

export function useEvents() {
    const [events, setEvents] = useState<EventItem[]>(() => loadEvents());

    useEffect(() => {
        const onStorage = (e: StorageEvent) => {
            if (!e.key || e.key.startsWith("sase.calendar")) {
                setEvents(loadEvents());
            }
        };

        const onCustomUpdate = () => {
            setEvents(loadEvents());
        };

        window.addEventListener("storage", onStorage);
        window.addEventListener("events:updated", onCustomUpdate);

        return () => {
            window.removeEventListener("storage", onStorage);
            window.removeEventListener("events:updated", onCustomUpdate);
        };
    }, []);

    return useMemo(
        () => ({
            events,
            get: (id: EventId) => getEventById(id),
            getByQuarter: (quarter: Quarter, academicYear: AcademicYear) =>
                getEventsByQuarter(quarter, academicYear),
        }),
        [events]
    );
}