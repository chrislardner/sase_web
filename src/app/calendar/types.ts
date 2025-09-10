export type EventId = string;

export interface EventItem {
    id: EventId;
    title: string;
    oneWordTitle: string;
    startsAt: string;
    endsAt?: string;
    description: string;
    location?: string;
    rsvpLink?: string;
    color?: string;
}
