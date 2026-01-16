export type Quarter = "fall" | "winter" | "spring";
export type AcademicYear = string; // ex: "2025-2026"

export type EventId = string; // {quarter}{year}-{number} ex: "F25-01", "W26-03", "S26-01"

export interface EventItem {
    id: EventId;
    title: string;
    oneWordTitle: string;
    startsAt: string;
    endsAt: string;
    description: string;
    location?: string;
    rsvpLink?: string;
    color?: string;
    quarter: Quarter;
    academicYear: AcademicYear;
}

export function parseEventId(id: EventId): { quarter: Quarter; year: number; sequence: number } | null {
    const match = id.match(/^([FWS])(\d{2})-(\d+)$/);
    if (!match) return null;

    const quarterMap: Record<string, Quarter> = {F: "fall", W: "winter", S: "spring"};
    return {
        quarter: quarterMap[match[1]],
        year: 2000 + parseInt(match[2], 10),
        sequence: parseInt(match[3], 10),
    };
}

export function createEventId(quarter: Quarter, year: number, sequence: number): EventId {
    const quarterPrefix = quarter[0].toUpperCase(); // F, W, or S
    const yearSuffix = String(year).slice(-2);      // Last 2 digits
    const seq = String(sequence).padStart(2, "0");
    return `${quarterPrefix}${yearSuffix}-${seq}`;
}

export function getAcademicYear(quarter: Quarter, calendarYear: number): AcademicYear {
    if (quarter === "fall") {
        return `${calendarYear}-${calendarYear + 1}`;
    }
    return `${calendarYear - 1}-${calendarYear}`;
}