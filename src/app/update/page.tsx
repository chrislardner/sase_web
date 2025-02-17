'use client';

import { useState, useEffect } from 'react';
import Table from '@/components/Table';

interface Member {
    name: string;
    year: number;
    email: string;
    events: string[];
    quarters: Record<string, number>;
    isActive: boolean;
    isCampusGroups: boolean;
}

export default function MembersPage() {
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchMembers = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/events');
            if (!response.ok) throw new Error('Failed to load members');

            const data = await response.json();
            setMembers(data.members);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMembers();
    }, []);

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const columns = [
        { key: 'name', label: 'Name' },
        { key: 'year', label: 'Year' },
        { key: 'email', label: 'Email' },
        { key: 'events', label: 'Events Attended' },
        { key: 'quarters', label: 'Quarters' },
        { key: 'isActive', label: 'Active Status' },
        {key: 'isCampusGroups', label: 'Campus Groups'}
    ];

    const tableData = members.map(member => ({
        ...member,
        events: member.events.map(event => formatDate(event)).join(', '),
        quarters: Object.entries(member.quarters).map(([quarter, count]) => `${quarter}: ${count}`).join(', '),
        isActive: member.isActive ? 'Active' : 'Inactive',
        isCampusGroups: member.isCampusGroups ? 'Yes' : 'No',
    }));

    return (
        <div className="min-h-screen p-2 bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark">
            <h1 className="text-2xl font-bold mb-2">Club Members</h1>

            {loading && <p>Loading members...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {members.length > 0 ? (
                <div className="overflow-x-auto mt-2">
                    <Table data={tableData} columns={columns} />
                </div>
            ) : (
                <p className="mt-2">No members found.</p>
            )}
        </div>
    );
}
