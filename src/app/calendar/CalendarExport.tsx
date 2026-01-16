"use client";

import {useState} from "react";
import {FaCalendarAlt, FaDownload} from "react-icons/fa";
import type {AcademicYear, EventItem, Quarter} from "./types";
import {
    downloadAcademicYearICS,
    downloadICS,
    downloadQuarterICS,
    filterByQuarterAndYear,
    getAvailableQuarters,
} from "./icsExport";

type Props = {
    events: EventItem[];
};

const QUARTER_LABELS: Record<Quarter, string> = {
    fall: "Fall",
    winter: "Winter",
    spring: "Spring",
};

export default function CalendarExport({events}: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const availableQuarters = getAvailableQuarters(events);

    const handleDownloadQuarter = (quarter: Quarter, academicYear: AcademicYear) => {
        downloadQuarterICS(events, quarter, academicYear);
    };

    const handleDownloadYear = (academicYear: AcademicYear) => {
        downloadAcademicYearICS(events, academicYear);
    };

    const handleDownloadAll = () => {
        downloadICS(events, "SASE_RHIT_All_Events.ics", "SASE RHIT All Events");
    };

    // Group quarters by academic year
    const quartersByYear = availableQuarters.reduce((acc, {quarter, academicYear}) => {
        if (!acc[academicYear]) acc[academicYear] = [];
        acc[academicYear].push(quarter);
        return acc;
    }, {} as Record<AcademicYear, Quarter[]>);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="btn btn-ghost flex items-center gap-2"
                aria-expanded={isOpen}
                aria-haspopup="menu"
            >
                <FaCalendarAlt aria-hidden/>
                <span>Export Calendar</span>
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                        aria-hidden
                    />

                    <div
                        className="absolute right-0 top-full mt-2 z-50 w-72 rounded-xl bg-white dark:bg-neutral-900 shadow-xl border border-black/10 dark:border-white/10 p-4"
                        role="menu"
                    >
                        <h3 className="text-sm font-semibold mb-3">Download Calendar Events</h3>

                        {Object.entries(quartersByYear).map(([academicYear, quarters]) => (
                            <div key={academicYear} className="mb-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                                        {academicYear}
                                    </span>
                                    <button
                                        onClick={() => handleDownloadYear(academicYear)}
                                        className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                                        role="menuitem"
                                    >
                                        <FaDownload className="text-[10px]" aria-hidden/>
                                        Full Year
                                    </button>
                                </div>

                                <div className="space-y-1">
                                    {quarters.map((quarter) => {
                                        const count = filterByQuarterAndYear(events, quarter, academicYear).length;
                                        return (
                                            <button
                                                key={`${quarter}-${academicYear}`}
                                                onClick={() => handleDownloadQuarter(quarter, academicYear)}
                                                className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                                                role="menuitem"
                                            >
                                                <span className="flex items-center gap-2">
                                                    <FaDownload className="text-neutral-400" aria-hidden/>
                                                    <span>{QUARTER_LABELS[quarter]} Quarter</span>
                                                </span>
                                                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                                                    {count} events
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}

                        <hr className="my-3 border-neutral-200 dark:border-neutral-700"/>

                        <button
                            onClick={handleDownloadAll}
                            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                            role="menuitem"
                        >
                            <FaDownload aria-hidden/>
                            Download All Events
                        </button>

                        <p className="mt-3 text-xs text-neutral-500 dark:text-neutral-400 text-center">
                            .ics files work with Google Calendar, Outlook, and Apple Calendar
                        </p>
                    </div>
                </>
            )}
        </div>
    );
}