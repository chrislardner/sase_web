import Link from 'next/link';

interface Event {
    id: string;
    title: string;
    date: string;
    description: string;
}

interface EventCardProps {
    event: Event;
}

export default function EventCard({event}: EventCardProps) {
    return (
        <div className="border p-4 rounded shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
            <p className="text-gray-600 mb-2">{new Date(event.date).toDateString()}</p>
            <p className="mb-4">{event.description}</p>
            <Link href={`/events/${event.id}`} className="text-blue-500 hover:underline">
                View Details & RSVP
            </Link>
        </div>
    );
}
