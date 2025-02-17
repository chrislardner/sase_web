import ResourceCard from '@/components/ResourceCard';

const dummyResources = [
  { id: '1', title: 'Resume Writing Guide', link: '/resources/resume.pdf', category: 'Career Advice' },
  { id: '2', title: 'Workshop Slides', link: '/resources/workshop.pdf', category: 'Workshops' }
];

export default function ResourcesPage() {
  return (
    <div className="min-h-screen">
      <h2 className="text-3xl font-bold mb-6">Resource Library</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {dummyResources.map(resource => (
          <ResourceCard key={resource.id} resource={resource} />
        ))}
      </div>
    </div>
  );
}
