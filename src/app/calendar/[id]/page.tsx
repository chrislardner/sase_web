"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";
import { useEvents } from "../useEvents";
import { formatEventDateTime } from "../datetime";

export default function EventDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const { get } = useEvents();
    const event = get(id);

    if (!event) return notFound();

    const { date, time } = formatEventDateTime(event.startsAt);

    return (
        <main className="page-shell">
            <div className="mb-4">
                <Link href="/calendar" className="inline-flex items-center gap-2 text-sm link">
                    <FaArrowLeft aria-hidden />
                    Back to Calendar
                </Link>
            </div>

            <h2 className="h2-title">{event.title}</h2>
            <p className="muted">
                {date} • {time}
                {event.location ? ` • ${event.location}` : ""}
            </p>

            {event.description && <p className="mt-4">{event.description}</p>}

            {event.rsvpLink && (
                <div className="mt-6">
                    <Link
                        href={event.rsvpLink}
                        className="btn btn-accent"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        RSVP
                    </Link>
                </div>
            )}
        </main>
    );
}
