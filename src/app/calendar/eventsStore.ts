"use client";

import type {EventId, EventItem} from "./types";

const STORAGE_KEY = "sase.calendar.v4";
const CONTENT_VERSION = "2025-10-30";
const TTL_MS = 1000 * 60 * 60 * 24 * 30;

type StoredPayload = {
    contentVersion: string; savedAt: number; items: EventItem[];
};

const COLORS = {
    blue: "rgb(25, 125, 200)",      // social
    red: "rgb(225, 25, 25)",        // professional
    yellow: "rgb(200, 200, 25)",     // service
    green: "rgb(25, 150, 25)",    // cultural
    orange: "rgb(200, 125, 25)",     // other
    gray: "rgb(150, 150, 150)",     // other
    pink: "rgb(250, 75, 150)",      // other
    teal: "rgb(25, 150, 150)",      // other
}

const seedEvents: EventItem[] = [{
    id: "1",
    title: "SASE Welcome Party",
    oneWordTitle: "Welcome Party",
    color: COLORS.blue,
    startsAt: "2025-09-04T19:00:00",
    description: "Join us at the Pi-Vilion for our kickoff meeting and enjoy local Terre Haute food",
    location: "Pi-Vilion"
}, {
    id: "2",
    title: "Boba Night",
    oneWordTitle: "Boba Night",
    color: COLORS.blue,
    startsAt: "2025-09-11T19:00:00",
    description: "Enjoy free homemade boba",
    location: "Pi-Vilion"
}, {
    id: "3",
    title: "SASE Courtyard Games",
    oneWordTitle: "Games Night",
    color: COLORS.blue,
    startsAt: "2025-09-18T19:00:00",
    description: "Featuring Mahjong, Jianzi, and more",
    location: "M107, Courtyard by NAB"
}, {
    id: "4",
    title: "Professional Development Panel",
    oneWordTitle: "Ingredion Panel",
    color: COLORS.red,
    startsAt: "2025-09-25T19:00:00",
    description: "Meet with Ingredion about internships and full-time roles",
    location: "M107"
}, {
    id: "5",
    title: "Fall Day of Service",
    oneWordTitle: "Fall Day of Service",
    color: COLORS.yellow,
    startsAt: "2025-09-27T09:00:00",
    description: "Join us for a day of service. Register by 9/22",
    location: "Union Circle"
}, {
    id: "6",
    title: "Sports",
    oneWordTitle: "SASE x SASA ",
    color: COLORS.blue,
    startsAt: "2025-10-23T09:00:00",
    description: "SASE x SASA Collab",
    location: "SRC"
}, {
    id: "7",
    title: "SASE National Conference",
    oneWordTitle: "Nationals",
    color: COLORS.red,
    startsAt: "2025-10-02T08:00:00",
    description: "Travel to SASE National Conference",
    location: "Pittsburgh, PA"
}, {
    id: "8",
    title: "SASE National Conference",
    oneWordTitle: "Nationals",
    color: COLORS.red,
    startsAt: "2025-10-03T08:00:00",
    description: "Travel to SASE National Conference",
    location: "Pittsburgh, PA"
}, {
    id: "9",
    title: "SASE National Conference",
    oneWordTitle: "Nationals",
    color: COLORS.red,
    startsAt: "2025-10-04T08:00:00",
    description: "Travel to SASE National Conference",
    location: "Pittsburgh, PA"
}, {
    id: "10",
    title: "Mid-Autumn Social Dinner",
    oneWordTitle: "Mid-Autumn Dinner",
    color: COLORS.blue,
    startsAt: "2025-10-05T18:00:00",
    description: "Celebrate Mid-Autumn with dinner with your SASE friends",
    location: "TBD"
}, {
    id: "11",
    title: "No Meeting — Fall Break",
    oneWordTitle: "Fall Break",
    color: COLORS.gray,
    startsAt: "2025-10-09T12:00:00",
    description: "Enjoy Fall Break—no regular meeting this week",
    location: "—"
}, {
    id: "11.1",
    title: "No Meeting — Fall Break",
    oneWordTitle: "Fall Break",
    color: COLORS.gray,
    startsAt: "2025-10-10T12:00:00",
    description: "Enjoy Fall Break—no regular meeting this week",
    location: "—"
}, {
    id: "12",
    title: "Onigiri Action",
    oneWordTitle: "Onigiri Action",
    color: COLORS.yellow,
    startsAt: "2025-10-16T19:00:00",
    description: "Make onigiri together and support a good cause",
    location: "Olin O231"
}, {
    id: "13",
    title: "Night Market",
    oneWordTitle: "Night Market",
    color: COLORS.green,
    startsAt: "2025-10-18T18:00:00",
    description: "Outdoor night market with food and activities",
    location: "NAB Courtyard"
}, {
    id: "15",
    title: "Games Night",
    oneWordTitle: "Games",
    color: COLORS.blue,
    startsAt: "2025-10-30T19:00:00",
    description: "Featuring Mahjong, Jianzi, and more",
    location: "Olin 231"
}, {
    id: "16",
    title: "Trunk or Treat",
    oneWordTitle: "Trunk or Treat",
    color: COLORS.yellow,
    startsAt: "2025-10-31T18:00:00",
    description: "Community Trunk or Treat event",
    location: "Speed Lot"
}, {
    id: "17",
    title: "TREES",
    oneWordTitle: "TREES",
    color: COLORS.yellow,
    startsAt: "2025-11-01T09:00:00",
    description: "Volunteer day with TREES",
    location: "Union Circle"
}, {
    id: "18",
    title: "Lantern Festival",
    oneWordTitle: "Lantern Festival",
    color: COLORS.blue,
    startsAt: "2025-11-06T19:00:00",
    description: "Lantern-making and celebration",
    location: "Speed Lake"
}, {
    id: "19",
    title: "Study Mode",
    oneWordTitle: "Study Mode",
    color: COLORS.blue,
    startsAt: "2025-11-13T19:00:00",
    description: "Quiet study session and community time",
    location: "Olin 231"
}, {
    id: "20",
    title: "No Meeting — Finals Week",
    oneWordTitle: "Finals Break",
    color: COLORS.gray,
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

export function deleteEvent(id: EventId) {
    saveEvents(loadEvents().filter(e => e.id !== id));
}
