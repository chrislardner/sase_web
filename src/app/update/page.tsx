'use client';

import React, {useState} from 'react';
import Papa from 'papaparse';
import Table from '@/app/update/components/Table';

interface AttendanceRecord {
    name: string;
    year: number;
    email: string;
    eventDate: Date;
    quarter: string;
    isCampusGroups: boolean;
}

interface Member {
    name: string;
    year: number;
    email: string;
    events: Date[];
    quarters: Record<string, number>;
    isActive: boolean;
    isCampusGroups: boolean;
}

const academicYearCalendar: Record<number, {
    fall: [Date, Date],
    winter: [Date, Date],
    spring: [Date, Date],
}> = {
    2024: {
        fall: [new Date(2024, 7, 21), new Date(2024, 10, 25)],
        winter: [new Date(2024, 11, 2), new Date(2025, 2, 3)],
        spring: [new Date(2025, 2, 10), new Date(2025, 5, 3)]
    },
};

function getQuarter(date: Date): string {
    const today = new Date();
    const currentYear = today.getFullYear();
    const previousYear = currentYear - 1;
    const relevantYears = [currentYear, previousYear];

    for (const year of relevantYears) {
        const calendar = academicYearCalendar[year];
        if (calendar) {
            if (date >= calendar.fall[0] && date <= calendar.fall[1]) {
                return `${year}Q1`;
            }
            if (date >= calendar.winter[0] && date <= calendar.winter[1]) {
                return `${year}Q2`;
            }
            if (date >= calendar.spring[0] && date <= calendar.spring[1]) {
                return `${year}Q3`;
            }
        }
    }
    throw new Error(`Date ${date} does not fall within any relevant academic quarter`);
}

const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            if (typeof event.target?.result === 'string') {
                resolve(event.target.result);
            } else {
                reject('File read error');
            }
        };
        reader.onerror = () => reject('Error reading file');
        reader.readAsText(file);
    });
};

export default function UpdatePage() {
    const [members, setMembers] = useState<Member[]>([]);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const allAttendanceRecords: AttendanceRecord[] = [];
        const uniqueRows = new Set<string>();
        const filesArray = Array.from(files);

        try {
            for (const file of filesArray) {
                const text = await readFileAsText(file);
                const parsed = Papa.parse(text, {
                    header: true,
                    skipEmptyLines: true,
                    dynamicTyping: true,
                    transformHeader: header => header.trim(),
                    transform: value => (value.trim())
                });

                if (parsed.errors.length > 0) {
                    parsed.errors.forEach((err, index) => {
                        console.warn(`Parsing error ${index + 1} in file ${file.name}:`, err);
                    });
                    setError(`Some rows in ${file.name} could not be parsed and were skipped.`);
                }

                (parsed.data as { [key: string]: string }[]).forEach(row => {
                    const rowString = JSON.stringify(row);
                    if (uniqueRows.has(rowString)) return;
                    uniqueRows.add(rowString);

                    try {
                        const eventDate = new Date(row["Checked-In Date"]);
                        if (isNaN(eventDate.getTime())) {
                            console.log(`Invalid date: ${row["Checked-In Date"]}`);
                            return;
                        }
                        const quarter = getQuarter(eventDate);
                        const year = parseInt(row["Year of Graduation"], 10);
                        allAttendanceRecords.push({
                            name: `${row["First Name"]} ${row["Last Name"]}`,
                            year,
                            email: row["Email"],
                            eventDate,
                            quarter,
                            isCampusGroups: row["Is Member"] === "Yes",
                        });
                    } catch (err) {
                        console.error('Error processing row:', err);
                    }
                });
            }

            const userAttendanceMap: Record<
                string,
                {
                    name: string;
                    year: number;
                    email: string;
                    events: Date[];
                    quarters: Record<string, number>;
                    isCampusGroups: boolean
                }
            > = {};

            allAttendanceRecords.forEach(record => {
                const key = record.email;
                if (!userAttendanceMap[key]) {
                    userAttendanceMap[key] = {
                        name: record.name,
                        year: record.year,
                        email: record.email,
                        events: [],
                        quarters: {},
                        isCampusGroups: record.isCampusGroups
                    };
                }
                userAttendanceMap[key].events.push(record.eventDate);
                if (!userAttendanceMap[key].quarters[record.quarter]) {
                    userAttendanceMap[key].quarters[record.quarter] = 0;
                }
                userAttendanceMap[key].quarters[record.quarter]++;
            });

            const lastQuarter = '2024Q1';
            const activeMembers = Object.values(userAttendanceMap).map(user => ({
                ...user,
                isActive: (user.quarters[lastQuarter] || 0) >= 4
            }));

            setMembers(activeMembers);
            setError(null);
        } catch (err) {
            console.error(err);
            setError('Failed to process files.');
        }
    };

    const exportToCSV = () => {
        if (!members.length) return;
        const csvRows = [];
        const headers = ["Name", "Year", "Email", "Is Active", "Is Campus Groups", "Events", "Quarters"];
        csvRows.push(headers.join(','));

        members.forEach(member => {
            const eventsStr = member.events.map(date => new Date(date).toLocaleDateString()).join(' | ');
            const quartersStr = Object.entries(member.quarters)
                .map(([q, count]) => `${q}: ${count}`)
                .join(' | ');
            const row = [
                member.name,
                isNaN(member.year) ? 'N/A' : member.year,
                member.email,
                member.isActive ? 'Active' : 'Inactive',
                member.isCampusGroups ? 'Yes' : 'No',
                `"${eventsStr}"`,
                `"${quartersStr}"`
            ];
            csvRows.push(row.join(','));
        });

        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], {type: 'text/csv'});
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'members.csv';
        a.click();
    };

    const uniqueQuarters = Array.from(new Set(members.flatMap(member => Object.keys(member.quarters))));
    const columns = [
        {key: 'name', label: 'Name'},
        {key: 'year', label: 'Year'},
        {key: 'email', label: 'Email'},
        ...uniqueQuarters.map(q => ({key: q, label: q})),
        {key: 'isActive', label: 'Active Status'},
        {key: 'isCampusGroups', label: 'Campus Groups'},
    ];

    const tableData = members.map(member => {
        const quarterData: Record<string, number | string> = {};
        uniqueQuarters.forEach(q => {
            const val = member.quarters[q];
            quarterData[q] = isNaN(val) ? 0 : (val || 0);
        });
        return {
            name: member.name,
            year: isNaN(member.year) ? 'N/A' : member.year,
            email: member.email,
            isActive: member.isActive ? 'Active' : 'Inactive',
            isCampusGroups: member.isCampusGroups ? 'Yes' : 'No',
            ...quarterData,
        };
    });

    return (
        <div className="min-h-screen p-4">
            <h1 className="text-2xl font-bold mb-4">Update Members</h1>
            <input type="file" accept=".csv" multiple onChange={handleFileChange} className="mb-4"/>
            {error && <p className="">{error}</p>}
            {members.length > 0 && (
                <>
                    <button onClick={exportToCSV} className="mb-4 px-4 py-2 rounded">
                        Download CSV
                    </button>
                    <div className="overflow-x-auto">
                        <Table data={tableData} columns={columns}/>
                    </div>
                </>
            )}
        </div>
    );
}
