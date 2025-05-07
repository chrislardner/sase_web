interface Member {
    id: string;
    name: string;
    major: string;
    linkedin: string;
    github: string;
}

interface MemberCardProps {
    member: Member;
}

export default function MemberCard({member}: MemberCardProps) {
    return (
        <div className="border p-4 rounded shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold">{member.name}</h3>
            <p className="text-gray-600">{member.major}</p>
            <div className="mt-2">
                <a href={member.linkedin} className="text-blue-500 hover:underline mr-2" target="_blank"
                   rel="noopener noreferrer">
                    LinkedIn
                </a>
                <a href={member.github} className="text-blue-500 hover:underline" target="_blank"
                   rel="noopener noreferrer">
                    GitHub
                </a>
            </div>
        </div>
    );
}
  