import MemberCard from '@/components/MemberCard';

const dummyMembers = [
  { id: '1', name: 'Zuko', major: 'Computer Science', linkedin: 'https://linkedin.com/in/zuko', github: 'https://github.com/zuko' },
  { id: '2', name: 'Aang', major: 'Electrical Engineering', linkedin: 'https://linkedin.com/in/aang', github: 'https://github.com/aang' }
];

export default function BoardPage() {
  return (
    <div className="min-h-screen">
      <h2 className="text-3xl font-bold mb-6">Board Directory</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {dummyMembers.map(member => (
          <MemberCard key={member.id} member={member} />
        ))}
      </div>
    </div>
  );
}
