/* eslint-disable @typescript-eslint/no-unused-vars */
interface Params {
    id: string;
  }
  
  const dummyEvent = {
    id: '1',
    title: 'SASE Kickoff Meeting',
    date: '2025-03-01', 
    description: 'Join us for the kickoff meeting with refreshments and networking.',
    details: 'Detailed information about the event goes here.'
  };
  
  export default function EventDetailsPage({ params }: { params: Params } ) {
    const event = dummyEvent;
    return (
      <div className="min-h-screen">
        <h2 className="text-3xl font-bold mb-4">{event.title}</h2>
        <p className="text-gray-600 mb-2">{new Date(event.date).toDateString()}</p>
        <p className="mb-4">{event.description}</p>
        <div className="mb-4">{event.details}</div>
        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          RSVP Now
        </button>
      </div>
    );
  }
  