interface Resource {
    id: string;
    title: string;
    link: string;
    category: string;
  }
  
  interface ResourceCardProps {
    resource: Resource;
  }
  
  export default function ResourceCard({ resource }: ResourceCardProps) {
    return (
      <div className="border p-4 rounded shadow hover:shadow-lg transition">
        <h3 className="text-xl font-semibold mb-2">{resource.title}</h3>
        <p className="text-gray-600 mb-2">{resource.category}</p>
        <a href={resource.link} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
          Download/View
        </a>
      </div>
    );
  }
  