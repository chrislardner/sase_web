import EventCard from '@/app/events/components/EventCard';

const dummyEvents = [
  {
    id: '1',
    title: 'SASE Kickoff Meeting',
    date: '2025-03-01',
    description: 'Join us for the kickoff meeting with refreshments and networking.'
  },
  {
    id: '2',
    title: 'Career Workshop',
    date: '2025-03-15',
    description: 'A workshop focused on career development and resume building.'
  }
];

export default function EventsPage() {
  return (
    <div className="min-h-screen">
      <h2 className="text-3xl font-bold mb-6">Upcoming Events</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {dummyEvents.map(event => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}
