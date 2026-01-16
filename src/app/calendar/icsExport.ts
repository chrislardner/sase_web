import type {AcademicYear, EventItem, Quarter} from "./types";

function toICSDateTime(date: Date): string {
    const pad = (n: number) => String(n).padStart(2, "0");
    return (
        date.getFullYear().toString() +
        pad(date.getMonth() + 1) +
        pad(date.getDate()) +
        "T" +
        pad(date.getHours()) +
        pad(date.getMinutes()) +
        pad(date.getSeconds())
    );
}

// function toICSDate(date: Date): string {
//     const pad = (n: number) => String(n).padStart(2, "0");
//     return (
//         date.getFullYear().toString() +
//         pad(date.getMonth() + 1) +
//         pad(date.getDate())
//     );
// }

function escapeICS(text: string): string {
    return text
        .replace(/\\/g, "\\\\")
        .replace(/;/g, "\\;")
        .replace(/,/g, "\\,")
        .replace(/\n/g, "\\n");
}

function foldLine(line: string): string {
    const maxLength = 75;
    if (line.length <= maxLength) return line;

    const lines: string[] = [];
    let remaining = line;

    while (remaining.length > maxLength) {
        lines.push(remaining.slice(0, maxLength));
        remaining = " " + remaining.slice(maxLength);
    }
    lines.push(remaining);

    return lines.join("\r\n");
}

function generateUID(event: EventItem): string {
    return `${event.id}@sase.rhit.edu`;
}

function eventToVEvent(event: EventItem): string {
    const start = new Date(event.startsAt);
    const end = new Date(event.endsAt);
    const now = new Date();

    const lines = [
        "BEGIN:VEVENT",
        `UID:${generateUID(event)}`,
        `DTSTAMP:${toICSDateTime(now)}`,
        `DTSTART:${toICSDateTime(start)}`,
        `DTEND:${toICSDateTime(end)}`,
        `SUMMARY:${escapeICS(event.title)}`,
    ];

    if (event.description) {
        lines.push(`DESCRIPTION:${escapeICS(event.description)}`);
    }

    if (event.location && event.location !== "-" && event.location !== "—") {
        lines.push(`LOCATION:${escapeICS(event.location)}`);
    }

    if (event.rsvpLink) {
        lines.push(`URL:${event.rsvpLink}`);
    }

    lines.push("END:VEVENT");

    return lines.map(foldLine).join("\r\n");
}

export function generateICS(events: EventItem[], calendarName: string = "SASE RHIT Events"): string {
    const vevents = events.map(eventToVEvent).join("\r\n");

    return [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//SASE RHIT//Calendar//EN",
        `X-WR-CALNAME:${escapeICS(calendarName)}`,
        "CALSCALE:GREGORIAN",
        "METHOD:PUBLISH",
        vevents,
        "END:VCALENDAR",
    ].join("\r\n");
}

export function filterByQuarter(events: EventItem[], quarter: Quarter): EventItem[] {
    return events.filter((e) => e.quarter === quarter);
}

export function filterByAcademicYear(events: EventItem[], academicYear: AcademicYear): EventItem[] {
    return events.filter((e) => e.academicYear === academicYear);
}

export function filterByQuarterAndYear(
    events: EventItem[],
    quarter: Quarter,
    academicYear: AcademicYear
): EventItem[] {
    return events.filter((e) => e.quarter === quarter && e.academicYear === academicYear);
}

export function getAvailableQuarters(events: EventItem[]): { quarter: Quarter; academicYear: AcademicYear }[] {
    const seen = new Set<string>();
    const result: { quarter: Quarter; academicYear: AcademicYear }[] = [];

    for (const event of events) {
        const key = `${event.quarter}-${event.academicYear}`;
        if (!seen.has(key)) {
            seen.add(key);
            result.push({quarter: event.quarter, academicYear: event.academicYear});
        }
    }

    const quarterOrder: Record<Quarter, number> = {fall: 0, winter: 1, spring: 2};
    result.sort((a, b) => {
        const yearCompare = a.academicYear.localeCompare(b.academicYear);
        if (yearCompare !== 0) return yearCompare;
        return quarterOrder[a.quarter] - quarterOrder[b.quarter];
    });

    return result;
}

export function downloadICS(events: EventItem[], filename: string, calendarName?: string): void {
    const ics = generateICS(events, calendarName);
    const blob = new Blob([ics], {type: "text/calendar;charset=utf-8"});
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename.endsWith(".ics") ? filename : `${filename}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

export function downloadQuarterICS(
    events: EventItem[],
    quarter: Quarter,
    academicYear: AcademicYear
): void {
    const filtered = filterByQuarterAndYear(events, quarter, academicYear);
    const quarterName = quarter.charAt(0).toUpperCase() + quarter.slice(1);
    const filename = `SASE_RHIT_${quarterName}_${academicYear.replace("-", "_")}.ics`;
    const calendarName = `SASE RHIT ${quarterName} ${academicYear}`;

    downloadICS(filtered, filename, calendarName);
}

export function downloadAcademicYearICS(events: EventItem[], academicYear: AcademicYear): void {
    const filtered = filterByAcademicYear(events, academicYear);
    const filename = `SASE_RHIT_${academicYear.replace("-", "_")}.ics`;
    const calendarName = `SASE RHIT ${academicYear}`;

    downloadICS(filtered, filename, calendarName);
}