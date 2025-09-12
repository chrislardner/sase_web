"use client";

import type {EventId, EventItem} from "./types";

const STORAGE_KEY = "sase.calendar.v4";
const CONTENT_VERSION = "2025-09-11";
const TTL_MS = 1000 * 60 * 60 * 24 * 30;

type StoredPayload = {
    contentVersion: string; savedAt: number; items: EventItem[];
};

const seedEvents: EventItem[] = [{
    id: "1",
    title: "SASE Welcome Party",
    oneWordTitle: "Welcome Party",
    color: "rgb(128, 0, 0)",
    startsAt: "2025-09-04T19:00:00",
    description: "Join us at the Pi-Vilion for our kickoff meeting and enjoy local Terre Haute food",
    location: "Pi-Vilion"
}, {
    id: "2",
    title: "Boba Night",
    oneWordTitle: "Boba Night",
    color: "rgb(5, 150, 105)",
    startsAt: "2025-09-11T19:00:00",
    description: "Enjoy free homemade boba",
    location: "Pi-Vilion"
}, {
    id: "3",
    title: "SASE Courtyard Games",
    oneWordTitle: "Games Night",
    color: "rgb(234, 88, 12)",
    startsAt: "2025-09-18T19:00:00",
    description: "Featuring Mahjong, Jianzi, and more",
    location: "Courtyard by NAB (aka FAB)"
}, {
    id: "4",
    title: "Professional Development Panel",
    oneWordTitle: "ADAPT Panel",
    color: "rgb(37, 99, 235)",
    startsAt: "2025-09-25T19:00:00",
    description: "Meet with ADAPT about internship and full-time roles",
    location: "TBD"
}, {
    id: "5",
    title: "Fall Day of Service",
    oneWordTitle: "Fall Day of Service",
    color: "rgb(2, 132, 199)",
    startsAt: "2025-09-27T09:00:00",
    description: "Join us for a day of service. Register by 9/22",
    location: "TBD"
}, {
    id: "6",
    title: "SASE National Conference",
    oneWordTitle: "Nationals",
    color: "rgb(124, 58, 237)",
    startsAt: "2025-10-02T08:00:00",
    description: "Travel to SASE National Conference",
    location: "Pittsburgh, PA"
}, {
    id: "7",
    title: "SASE National Conference",
    oneWordTitle: "Nationals",
    color: "rgb(124, 58, 237)",
    startsAt: "2025-10-03T08:00:00",
    description: "Travel to SASE National Conference",
    location: "Pittsburgh, PA"
}, {
    id: "8",
    title: "SASE National Conference",
    oneWordTitle: "Nationals",
    color: "rgb(124, 58, 237)",
    startsAt: "2025-10-04T08:00:00",
    description: "Travel to SASE National Conference",
    location: "Pittsburgh, PA"
}, {
    id: "9",
    title: "Mid-Autumn Social Dinner",
    oneWordTitle: "Mid-Autumn Dinner",
    color: "rgb(217, 119, 6)",
    startsAt: "2025-10-05T18:00:00",
    description: "Celebrate Mid-Autumn with dinner with your SASE friends",
    location: "TBD"
}, {
    id: "10",
    title: "No Meeting — Fall Break",
    oneWordTitle: "Fall Break",
    color: "rgb(107, 114, 128)",
    startsAt: "2025-10-09T12:00:00",
    description: "Enjoy Fall Break—no regular meeting this week",
    location: "—"
}, {
    id: "11",
    title: "Onigiri Action",
    oneWordTitle: "Onigiri Action",
    color: "rgb(16, 185, 129)",
    startsAt: "2025-10-16T19:00:00",
    description: "Make onigiri together and support a good cause",
    location: "TBD"
}, {
    id: "12",
    title: "Night Market",
    oneWordTitle: "Night Market",
    color: "rgb(190, 18, 60)",
    startsAt: "2025-10-18T18:00:00",
    description: "Outdoor night market with food and activities",
    location: "TBD"
}, {
    id: "13",
    title: "Crafts Night",
    oneWordTitle: "Crafts Night",
    color: "rgb(99, 102, 241)",
    startsAt: "2025-10-23T19:00:00",
    description: "Relaxed craft night",
    location: "TBD"
}, {
    id: "14",
    title: "Social Outing — Skating or Bowling",
    oneWordTitle: "Outing",
    color: "rgb(59, 130, 246)",
    startsAt: "2025-10-30T19:00:00",
    description: "Free skating, bowling, or similar activity out in Terre Haute",
    location: "TBD"
}, {
    id: "15",
    title: "Trunk or Treat",
    oneWordTitle: "Trunk or Treat",
    color: "rgb(234, 88, 12)",
    startsAt: "2025-10-31T18:00:00",
    description: "Community Trunk or Treat event",
    location: "Speed Lot"
}, {
    id: "16",
    title: "TREES",
    oneWordTitle: "TREES",
    color: "rgb(2, 132, 199)",
    startsAt: "2025-11-01T09:00:00",
    description: "Volunteer day with TREES",
    location: "Terre Haute"
}, {
    id: "17",
    title: "Lantern Festival",
    oneWordTitle: "Lantern Festival",
    color: "rgb(128, 0, 0)",
    startsAt: "2025-11-06T19:00:00",
    description: "Lantern-making and celebration",
    location: "TBD"
}, {
    id: "18",
    title: "Study Mode",
    oneWordTitle: "Study Mode",
    color: "rgb(107, 114, 128)",
    startsAt: "2025-11-13T19:00:00",
    description: "Quiet study session and community time",
    location: "TBD"
}, {
    id: "19",
    title: "No Meeting — Finals Week",
    oneWordTitle: "Finals Break",
    color: "rgb(107, 114, 128)",
    startsAt: "2025-11-20T12:00:00",
    description: "No meeting this week. Good luck with exams and have a restful break!",
    location: "—"
},];


function canUseStorage() {
    return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function sortByStart(items: EventItem[]) {
    return [...items].sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());
}

function writeSeeds(): EventItem[] {
    const payload: StoredPayload = {
        contentVersion: CONTENT_VERSION, savedAt: Date.now(), items: sortByStart(seedEvents)
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    window.dispatchEvent(new CustomEvent("events:updated"));
    return payload.items;
}

export function loadEvents(): EventItem[] {
    if (!canUseStorage()) return sortByStart(seedEvents);

    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return writeSeeds();

    try {
        const parsed = JSON.parse(raw) as StoredPayload;

        if (parsed.contentVersion !== CONTENT_VERSION) {
            return writeSeeds();
        }

        if (Date.now() - (parsed.savedAt || 0) > TTL_MS) {
            return writeSeeds();
        }

        const items = (parsed.items || []).filter(e => e);
        return sortByStart(items);
    } catch {
        return writeSeeds();
    }
}

export function saveEvents(events: EventItem[]) {
    if (!canUseStorage()) return;
    const payload: StoredPayload = {
        contentVersion: CONTENT_VERSION, savedAt: Date.now(), items: sortByStart(events)
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    window.dispatchEvent(new CustomEvent("events:updated"));
}

export function getEventById(id: EventId): EventItem | undefined {
    return loadEvents().find(e => e.id === id);
}

export function upsertEvent(event: EventItem) {
    const events = loadEvents();
    const idx = events.findIndex(e => e.id === event.id);
    if (idx >= 0) events[idx] = event; else events.push(event);
    saveEvents(events);
}

export function deleteEvent(id: EventId) {
    saveEvents(loadEvents().filter(e => e.id !== id));
}
