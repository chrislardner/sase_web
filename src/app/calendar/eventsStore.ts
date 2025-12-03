"use client";

import type { EventId, EventItem, Quarter, AcademicYear } from "./types";

const STORAGE_KEY = "sase.calendar.v5";
const CONTENT_VERSION = "2025-12-03.v6";
const TTL_MS = 1000 * 60 * 60 * 24 * 30;

type StoredPayload = {
    contentVersion: string;
    savedAt: number;
    items: EventItem[];
};

const COLORS = {
    social: "rgb(25, 125, 200)",           // blue
    professional: "rgb(225, 25, 25)",      // red
    service: "rgb(200, 200, 25)",          // yellow
    cultural: "rgb(25, 150, 25)",          // green
    other_orange: "rgb(200, 125, 25)",
    other_no_meeting: "rgb(150, 150, 150)", // gray
    other_special: "rgb(250, 75, 150)",    // pink
    other_teal: "rgb(25, 150, 150)",
};

type EventInput = {
    id: EventId;
    title: string;
    oneWordTitle: string;
    color: string;
    startsAt: string;
    endsAt?: string;
    description: string;
    location?: string;
    rsvpLink?: string;
    quarter: Quarter;
    academicYear: AcademicYear;
};

function createEvent(input: EventInput): EventItem {
    const start = new Date(input.startsAt);
    const end = input.endsAt
        ? input.endsAt
        : new Date(start.getTime() + 60 * 60 * 1000).toISOString();

    return {
        ...input,
        endsAt: end,
        location: input.location ?? "TBD",
    };
}

const FALL_2025: EventItem[] = [
    createEvent({
        id: "F25-01",
        title: "SASE Welcome Party",
        oneWordTitle: "Welcome Party",
        color: COLORS.social,
        startsAt: "2025-09-04T19:00:00",
        description: "Join us at the Pi-Vilion for our kickoff meeting and enjoy local Terre Haute food",
        location: "Pi-Vilion",
        quarter: "fall",
        academicYear: "2025-2026",
    }),
    createEvent({
        id: "F25-02",
        title: "Boba Night",
        oneWordTitle: "Boba Night",
        color: COLORS.social,
        startsAt: "2025-09-11T19:00:00",
        description: "Enjoy free homemade boba",
        location: "Pi-Vilion",
        quarter: "fall",
        academicYear: "2025-2026",
    }),
    createEvent({
        id: "F25-03",
        title: "SASE Courtyard Games",
        oneWordTitle: "Games Night",
        color: COLORS.social,
        startsAt: "2025-09-18T19:00:00",
        description: "Featuring Mahjong, Jianzi, and more",
        location: "M107, Courtyard by NAB",
        quarter: "fall",
        academicYear: "2025-2026",
    }),
    createEvent({
        id: "F25-04",
        title: "Professional Development Panel",
        oneWordTitle: "Ingredion Panel",
        color: COLORS.professional,
        startsAt: "2025-09-25T19:00:00",
        description: "Meet with Ingredion about internships and full-time roles",
        location: "M107",
        quarter: "fall",
        academicYear: "2025-2026",
    }),
    createEvent({
        id: "F25-05",
        title: "Fall Day of Service",
        oneWordTitle: "Fall Day of Service",
        color: COLORS.service,
        startsAt: "2025-09-27T09:00:00",
        endsAt: "2025-09-27T12:00:00",
        description: "Join us for a day of service. Register by 9/22",
        location: "Union Circle",
        quarter: "fall",
        academicYear: "2025-2026",
    }),
    createEvent({
        id: "F25-06",
        title: "SASE National Conference",
        oneWordTitle: "Nationals",
        color: COLORS.professional,
        startsAt: "2025-10-02T08:00:00",
        endsAt: "2025-10-02T18:00:00",
        description: "Travel to SASE National Conference",
        location: "Pittsburgh, PA",
        quarter: "fall",
        academicYear: "2025-2026",
    }),
    createEvent({
        id: "F25-07",
        title: "SASE National Conference",
        oneWordTitle: "Nationals",
        color: COLORS.professional,
        startsAt: "2025-10-03T08:00:00",
        endsAt: "2025-10-03T18:00:00",
        description: "SASE National Conference Day 2",
        location: "Pittsburgh, PA",
        quarter: "fall",
        academicYear: "2025-2026",
    }),
    createEvent({
        id: "F25-08",
        title: "SASE National Conference",
        oneWordTitle: "Nationals",
        color: COLORS.professional,
        startsAt: "2025-10-04T08:00:00",
        endsAt: "2025-10-04T18:00:00",
        description: "SASE National Conference Day 3",
        location: "Pittsburgh, PA",
        quarter: "fall",
        academicYear: "2025-2026",
    }),
    createEvent({
        id: "F25-09",
        title: "Mid-Autumn Social Dinner",
        oneWordTitle: "Mid-Autumn Dinner",
        color: COLORS.social,
        startsAt: "2025-10-05T18:00:00",
        endsAt: "2025-10-05T20:00:00",
        description: "Celebrate Mid-Autumn with dinner with your SASE friends",
        location: "TBD",
        quarter: "fall",
        academicYear: "2025-2026",
    }),
    createEvent({
        id: "F25-10",
        title: "No Meeting - Fall Break",
        oneWordTitle: "Fall Break",
        color: COLORS.other_no_meeting,
        startsAt: "2025-10-09T12:00:00",
        endsAt: "2025-10-10T12:00:00",
        description: "Enjoy Fall Break - no regular meeting this week",
        location: "-",
        quarter: "fall",
        academicYear: "2025-2026",
    }),
    createEvent({
        id: "F25-11",
        title: "Onigiri Action",
        oneWordTitle: "Onigiri Action",
        color: COLORS.service,
        startsAt: "2025-10-16T19:00:00",
        description: "Make onigiri together and support a good cause",
        location: "Olin O231",
        quarter: "fall",
        academicYear: "2025-2026",
    }),
    createEvent({
        id: "F25-12",
        title: "Night Market",
        oneWordTitle: "Night Market",
        color: COLORS.cultural,
        startsAt: "2025-10-18T18:00:00",
        endsAt: "2025-10-18T21:00:00",
        description: "Outdoor night market with food and activities",
        location: "NAB Courtyard",
        quarter: "fall",
        academicYear: "2025-2026",
    }),
    createEvent({
        id: "F25-13",
        title: "Sports",
        oneWordTitle: "SASE x SASA",
        color: COLORS.social,
        startsAt: "2025-10-23T19:00:00",
        endsAt: "2025-10-23T21:00:00",
        description: "SASE x SASA Collab",
        location: "SRC",
        quarter: "fall",
        academicYear: "2025-2026",
    }),
    createEvent({
        id: "F25-14",
        title: "Games Night",
        oneWordTitle: "Games",
        color: COLORS.social,
        startsAt: "2025-10-30T19:00:00",
        description: "Featuring Mahjong, Jianzi, and more",
        location: "Olin 231",
        quarter: "fall",
        academicYear: "2025-2026",
    }),
    createEvent({
        id: "F25-15",
        title: "Trunk or Treat",
        oneWordTitle: "Trunk or Treat",
        color: COLORS.service,
        startsAt: "2025-10-31T18:00:00",
        endsAt: "2025-10-31T20:00:00",
        description: "Community Trunk or Treat event",
        location: "Speed Lot",
        quarter: "fall",
        academicYear: "2025-2026",
    }),
    createEvent({
        id: "F25-16",
        title: "TREES",
        oneWordTitle: "TREES",
        color: COLORS.service,
        startsAt: "2025-11-01T09:00:00",
        endsAt: "2025-11-01T12:00:00",
        description: "Volunteer day with TREES",
        location: "Union Circle",
        quarter: "fall",
        academicYear: "2025-2026",
    }),
    createEvent({
        id: "F25-17",
        title: "Lantern Festival",
        oneWordTitle: "Lantern Festival",
        color: COLORS.social,
        startsAt: "2025-11-06T19:00:00",
        description: "Lantern-making and celebration",
        location: "Speed Lake",
        quarter: "fall",
        academicYear: "2025-2026",
    }),
    createEvent({
        id: "F25-18",
        title: "Study Mode",
        oneWordTitle: "Study Mode",
        color: COLORS.social,
        startsAt: "2025-11-13T19:00:00",
        endsAt: "2025-11-13T21:00:00",
        description: "Quiet study session and community time",
        location: "Olin 231",
        quarter: "fall",
        academicYear: "2025-2026",
    }),
    createEvent({
        id: "F25-19",
        title: "No Meeting - Finals Week",
        oneWordTitle: "Finals Break",
        color: COLORS.other_no_meeting,
        startsAt: "2025-11-20T12:00:00",
        description: "No meeting this week. Good luck with exams and have a restful break!",
        location: "-",
        quarter: "fall",
        academicYear: "2025-2026",
    }),
    createEvent({
        id: "F25-20",
        title: "No Meeting - Thanksgiving",
        oneWordTitle: "Thanksgiving",
        color: COLORS.other_no_meeting,
        startsAt: "2025-11-27T12:00:00",
        description: "No meeting this week. Happy Thanksgiving and have a restful break!",
        location: "-",
        quarter: "fall",
        academicYear: "2025-2026",
    }),
];

const WINTER_2026: EventItem[] = [
    createEvent({
        id: "W26-01",
        title: "Chopsticks",
        oneWordTitle: "Chopsticks",
        color: COLORS.social,
        startsAt: "2025-12-04T19:00:00",
        description: "Cultural food-themed meeting",
        location: "Olin 231",
        quarter: "winter",
        academicYear: "2025-2026",
    }),
    createEvent({
        id: "W26-02",
        title: "Bikes for Tykes",
        oneWordTitle: "Bike Charity",
        color: COLORS.service,
        startsAt: "2025-12-07T08:00:00",
        endsAt: "2025-12-07T12:00:00",
        description: "Winter service event supporting Bikes for Tykes",
        location: "SRC",
        quarter: "winter",
        academicYear: "2025-2026",
    }),
    createEvent({
        id: "W26-03",
        title: "Boba Night - Charity",
        oneWordTitle: "Boba Night",
        color: COLORS.social,
        startsAt: "2025-12-11T19:00:00",
        description: "Boba Night charity event; Thai tea, milk, condensed milk, boba, and earrings sale",
        location: "TBD",
        quarter: "winter",
        academicYear: "2025-2026",
    }),
    createEvent({
        id: "W26-04",
        title: "Skating Night",
        oneWordTitle: "Skating",
        color: COLORS.social,
        startsAt: "2025-12-18T19:00:00",
        endsAt: "2025-12-18T21:00:00",
        description: "Ice skating social (18+). Wednesday if Thursday does not work.",
        location: "TBD",
        quarter: "winter",
        academicYear: "2025-2026",
    }),
    createEvent({
        id: "W26-05",
        title: "Winter Break - No Meeting",
        oneWordTitle: "Winter Break",
        color: COLORS.other_no_meeting,
        startsAt: "2025-12-25T12:00:00",
        description: "Merry Christmas and Happy Holidays! No meetings between 12/19 and 1/5",
        location: "-",
        quarter: "winter",
        academicYear: "2025-2026",
    }),
    createEvent({
        id: "W26-06",
        title: "Winter Break - No Meeting",
        oneWordTitle: "Winter Break",
        color: COLORS.other_no_meeting,
        startsAt: "2026-01-01T12:00:00",
        description: "Happy New Year! No meetings between 12/19 and 1/5",
        location: "-",
        quarter: "winter",
        academicYear: "2025-2026",
    }),
    createEvent({
        id: "W26-07",
        title: "Mochi x Matcha Making",
        oneWordTitle: "Mochi & Matcha",
        color: COLORS.cultural,
        startsAt: "2026-01-08T19:00:00",
        description: "Cultural cooking event: make mochi and matcha",
        location: "TBD",
        quarter: "winter",
        academicYear: "2025-2026",
    }),
    createEvent({
        id: "W26-08",
        title: "HII Workshop",
        oneWordTitle: "HII Workshop",
        color: COLORS.professional,
        startsAt: "2026-01-15T19:00:00",
        description: "Professional HII workshop",
        location: "Olin 231",
        quarter: "winter",
        academicYear: "2025-2026",
    }),
    createEvent({
        id: "W26-09",
        title: "No Meeting - Winter",
        oneWordTitle: "No Meeting",
        color: COLORS.other_no_meeting,
        startsAt: "2026-01-22T12:00:00",
        description: "No meeting this week",
        location: "-",
        quarter: "winter",
        academicYear: "2025-2026",
    }),
    createEvent({
        id: "W26-10",
        title: "LNY Lanterns",
        oneWordTitle: "Lanterns",
        color: COLORS.cultural,
        startsAt: "2026-01-29T19:00:00",
        description: "Lunar New Year lantern-making",
        location: "Olin 231",
        quarter: "winter",
        academicYear: "2025-2026",
    }),
    createEvent({
        id: "W26-11",
        title: "Annual Karaoke Night",
        oneWordTitle: "Karaoke",
        color: COLORS.social,
        startsAt: "2026-02-05T19:00:00",
        description: "Annual karaoke event",
        location: "Olin 231",
        quarter: "winter",
        academicYear: "2025-2026",
    }),
    createEvent({
        id: "W26-12",
        title: "Elections Notice Period",
        oneWordTitle: "Elections Notice",
        color: COLORS.other_special,
        startsAt: "2026-02-11T12:00:00",
        description: "Elections notice period begins",
        location: "-",
        quarter: "winter",
        academicYear: "2025-2026",
    }),
    createEvent({
        id: "W26-13",
        title: "Hot Cocoa Night",
        oneWordTitle: "Hot Cocoa Night",
        color: COLORS.social,
        startsAt: "2026-02-12T19:00:00",
        description: "Relax with hot cocoa and friends",
        location: "Olin 231",
        quarter: "winter",
        academicYear: "2025-2026",
    }),
    createEvent({
        id: "W26-14",
        title: "LNY 2026 Celebration",
        oneWordTitle: "LNY 2026 - Starting Time TBD",
        color: COLORS.cultural,
        startsAt: "2026-02-14T19:00:00",
        endsAt: "2026-02-14T21:00:00",
        description: "Main Lunar New Year celebration",
        location: "Khan Room, Mussallem Union",
        quarter: "winter",
        academicYear: "2025-2026",
    }),
    createEvent({
        id: "W26-15",
        title: "SASE Elections",
        oneWordTitle: "Elections",
        color: COLORS.other_teal,
        startsAt: "2026-02-19T19:00:00",
        description: "Officer elections for next year",
        location: "Olin 231",
        quarter: "winter",
        academicYear: "2025-2026",
    }),
    createEvent({
        id: "W26-16",
        title: "No Meeting - Finals Week",
        oneWordTitle: "No Meeting",
        color: COLORS.other_no_meeting,
        startsAt: "2026-02-26T19:00:00",
        description: "Good luck on Finals and enjoy your break!",
        location: "-",
        quarter: "winter",
        academicYear: "2025-2026",
    }),
    createEvent({
        id: "W26-17",
        title: "No Meeting - End of Winter Quarter Break",
        oneWordTitle: "No Meeting",
        color: COLORS.other_no_meeting,
        startsAt: "2026-03-05T19:00:00",
        description: "Enjoy your break!",
        location: "-",
        quarter: "winter",
        academicYear: "2025-2026",
    }),
];

const SPRING_2026: EventItem[] = [
    // createEvent({
    //     id: "S26-01",
    //     title: "Spring Welcome Back",
    //     oneWordTitle: "Welcome Back",
    //     color: COLORS.social,
    //     startsAt: "2026-03-12T19:00:00",
    //     description: "Welcome back from break!",
    //     location: "Olin 231",
    //     quarter: "spring",
    //     academicYear: "2025-2026",
    // }),
];

const seedEvents: EventItem[] = [
    ...FALL_2025,
    ...WINTER_2026,
    ...SPRING_2026,
];

function canUseStorage(): boolean {
    return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function sortByStart(items: EventItem[]): EventItem[] {
    return [...items].sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());
}

function writeSeeds(): EventItem[] {
    const payload: StoredPayload = {
        contentVersion: CONTENT_VERSION,
        savedAt: Date.now(),
        items: sortByStart(seedEvents),
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

        const items = (parsed.items || []).filter((e) => e);
        return sortByStart(items);
    } catch {
        return writeSeeds();
    }
}

export function saveEvents(events: EventItem[]): void {
    if (!canUseStorage()) return;
    const payload: StoredPayload = {
        contentVersion: CONTENT_VERSION,
        savedAt: Date.now(),
        items: sortByStart(events),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    window.dispatchEvent(new CustomEvent("events:updated"));
}

export function getEventById(id: EventId): EventItem | undefined {
    return loadEvents().find((e) => e.id === id);
}

export function deleteEvent(id: EventId): void {
    saveEvents(loadEvents().filter((e) => e.id !== id));
}

export function getEventsByQuarter(quarter: Quarter, academicYear: AcademicYear): EventItem[] {
    return loadEvents().filter((e) => e.quarter === quarter && e.academicYear === academicYear);
}

export function getFallEvents(academicYear: AcademicYear): EventItem[] {
    return getEventsByQuarter("fall", academicYear);
}

export function getWinterEvents(academicYear: AcademicYear): EventItem[] {
    return getEventsByQuarter("winter", academicYear);
}

export function getSpringEvents(academicYear: AcademicYear): EventItem[] {
    return getEventsByQuarter("spring", academicYear);
}

export { COLORS };