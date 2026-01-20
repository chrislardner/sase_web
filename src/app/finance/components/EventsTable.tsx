import {useMemo, useState} from 'react';
import {motion} from 'framer-motion';
import type {EventItem} from '@/app/calendar/types';
import {AcademicYear} from "@/app/calendar/types";
import type {BudgetCategory, FinanceEvent, PlannedEvent} from '../types/finance';
import {formatCurrency, formatDate, parseNumber} from '../lib/financeUtils';
import {FaEdit, FaPlus, FaSearch, FaSort, FaSortDown, FaSortUp, FaTrash} from 'react-icons/fa';

interface EventsTableProps {
    academicYear: AcademicYear;
    calendarEvents: EventItem[];
    financeEvents: FinanceEvent[];
    plannedEvents: PlannedEvent[];
    onEditEvent: (eventId: string, finance?: FinanceEvent) => void;
    onCreateEvent?: (eventId: string) => void;
    onDeleteEvent?: (financeId: string) => void;
}

type SortField = 'date' | 'title' | 'category' | 'sga' | 'groupFunds' | 'total';
type SortDirection = 'asc' | 'desc';
type EventTypeFilter = 'all' | 'actual' | 'planned';

interface CombinedEventRow {
    id: string;
    title: string;
    date: string;
    category: BudgetCategory | 'N/A';
    sgaAmount: number;
    groupFundsAmount: number;
    totalCost: number;
    hasFinance: boolean;
    finance?: FinanceEvent;
    eventId?: string;
    isPlanned: boolean; // ✅ NEW: Track if this is a planned event
}

export function EventsTable({
                                academicYear,
                                calendarEvents,
                                financeEvents,
                                plannedEvents,
                                onEditEvent,
                                onCreateEvent,
                                onDeleteEvent,
                            }: EventsTableProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<BudgetCategory | 'all'>('all');
    const [eventTypeFilter, setEventTypeFilter] = useState<EventTypeFilter>('all'); // ✅ NEW
    const [sortField, setSortField] = useState<SortField>('date');
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

    const rows = useMemo<CombinedEventRow[]>(() => {
        const yearEvents = calendarEvents.filter(e => e.academicYear === academicYear);

        const combined: CombinedEventRow[] = [
            ...yearEvents.map(event => {
                const finance = financeEvents.find(f => f.eventId === event.id);
                return {
                    id: event.id,
                    title: event.title,
                    date: event.startsAt,
                    category: finance?.category || 'N/A' as const,
                    sgaAmount: parseNumber(finance?.sgaAmount),
                    groupFundsAmount: parseNumber(finance?.groupFundsAmount),
                    totalCost: parseNumber(finance?.totalCost),
                    hasFinance: !!finance,
                    finance,
                    eventId: event.id,
                    isPlanned: false, // ✅ Actual events
                };
            }),
            ...plannedEvents
                .filter(pe => pe.academicYear === academicYear)
                .map(pe => ({
                    id: pe.id,
                    title: `[PLANNED] ${pe.title}`,
                    date: pe.date,
                    category: pe.category,
                    sgaAmount: parseNumber(pe.sgaAmount),
                    groupFundsAmount: parseNumber(pe.groupFundsAmount),
                    totalCost: parseNumber(pe.estimatedCost),
                    hasFinance: true,
                    eventId: undefined,
                    isPlanned: true,
                })),
        ];

        return combined;
    }, [calendarEvents, financeEvents, plannedEvents, academicYear]);

    const filteredRows = useMemo(() => {
        let filtered = rows;

        if (eventTypeFilter === 'actual') {
            filtered = filtered.filter(r => !r.isPlanned);
        } else if (eventTypeFilter === 'planned') {
            filtered = filtered.filter(r => r.isPlanned);
        }

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(r => r.title.toLowerCase().includes(term));
        }

        if (categoryFilter !== 'all') {
            filtered = filtered.filter(r => r.category === categoryFilter);
        }

        return [...filtered].sort((a, b) => {
            let comparison = 0;

            switch (sortField) {
                case 'date':
                    comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
                    break;
                case 'title':
                    comparison = a.title.localeCompare(b.title);
                    break;
                case 'category':
                    comparison = a.category.localeCompare(b.category);
                    break;
                case 'sga':
                    comparison = a.sgaAmount - b.sgaAmount;
                    break;
                case 'groupFunds':
                    comparison = a.groupFundsAmount - b.groupFundsAmount;
                    break;
                case 'total':
                    comparison = a.totalCost - b.totalCost;
                    break;
            }

            return sortDirection === 'asc' ? comparison : -comparison;
        });
    }, [rows, searchTerm, categoryFilter, eventTypeFilter, sortField, sortDirection]);

    const totals = useMemo(() => {
        const sga = filteredRows.reduce((sum, r) => sum + r.sgaAmount, 0);
        const groupFunds = filteredRows.reduce((sum, r) => sum + r.groupFundsAmount, 0);
        const total = filteredRows.reduce((sum, r) => sum + r.totalCost, 0);

        return {sga, groupFunds, total};
    }, [filteredRows]);

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const SortIcon = ({field}: { field: SortField }) => {
        if (sortField !== field) return <FaSort className="text-neutral-400"/>;
        return sortDirection === 'asc' ? <FaSortUp/> : <FaSortDown/>;
    };

    const handleDelete = (financeId: string) => {
        if (onDeleteEvent) {
            if (confirm('Are you sure you want to delete this finance entry? This cannot be undone.')) {
                onDeleteEvent(financeId);
            }
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="h2-title">All Events - {academicYear}</h2>
                <p className="lead">Complete event list with filtering and sorting</p>
            </div>

            <div className="card card-body">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"/>
                        <input
                            type="text"
                            placeholder="Search events..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rhit-maroon dark:bg-neutral-800 dark:border-neutral-700"
                        />
                    </div>

                    <select
                        value={eventTypeFilter}
                        onChange={(e) => setEventTypeFilter(e.target.value as EventTypeFilter)}
                        className="px-4 py-2 border rounded-lg dark:bg-neutral-800 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-rhit-maroon"
                    >
                        <option value="all">All Events</option>
                        <option value="actual">Actual Events Only</option>
                        <option value="planned">Planned Events Only</option>
                    </select>

                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value as typeof categoryFilter)}
                        className="px-4 py-2 border rounded-lg dark:bg-neutral-800 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-rhit-maroon"
                    >
                        <option value="all">All Categories</option>
                        <option value="Travel">Travel</option>
                        <option value="Cultural Events">Cultural Events</option>
                        <option value="Social/Service">Social/Service</option>
                    </select>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-neutral-200 dark:border-neutral-800 mt-4">
                    <span className="text-sm card-subtle">
                        Showing {filteredRows.length} of {rows.length} events
                    </span>
                    <div className="flex gap-6 text-sm font-medium">
                        <span className="text-red-600 dark:text-red-400">
                            SGA: {formatCurrency(totals.sga)}
                        </span>
                        <span className="text-blue-600 dark:text-blue-400">
                            Group Funds: {formatCurrency(totals.groupFunds)}
                        </span>
                        <span className="font-bold">
                            Total: {formatCurrency(totals.total)}
                        </span>
                    </div>
                </div>
            </div>

            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-neutral-50 dark:bg-neutral-800">
                        <tr>
                            <th
                                onClick={() => handleSort('date')}
                                className="text-left py-3 px-4 text-sm font-semibold cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-700"
                            >
                                <div className="flex items-center gap-2">
                                    Date
                                    <SortIcon field="date"/>
                                </div>
                            </th>
                            <th
                                onClick={() => handleSort('title')}
                                className="text-left py-3 px-4 text-sm font-semibold cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-700"
                            >
                                <div className="flex items-center gap-2">
                                    Event
                                    <SortIcon field="title"/>
                                </div>
                            </th>
                            <th
                                onClick={() => handleSort('category')}
                                className="text-left py-3 px-4 text-sm font-semibold cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-700"
                            >
                                <div className="flex items-center gap-2">
                                    Category
                                    <SortIcon field="category"/>
                                </div>
                            </th>
                            <th
                                onClick={() => handleSort('sga')}
                                className="text-right py-3 px-4 text-sm font-semibold cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-700"
                            >
                                <div className="flex items-center justify-end gap-2">
                                    SGA
                                    <SortIcon field="sga"/>
                                </div>
                            </th>
                            <th
                                onClick={() => handleSort('groupFunds')}
                                className="text-right py-3 px-4 text-sm font-semibold cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-700"
                            >
                                <div className="flex items-center justify-end gap-2">
                                    Group Funds
                                    <SortIcon field="groupFunds"/>
                                </div>
                            </th>
                            <th
                                onClick={() => handleSort('total')}
                                className="text-right py-3 px-4 text-sm font-semibold cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-700"
                            >
                                <div className="flex items-center justify-end gap-2">
                                    Total
                                    <SortIcon field="total"/>
                                </div>
                            </th>
                            <th className="text-center py-3 px-4 text-sm font-semibold">
                                Actions
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredRows.map((row, index) => (
                            <motion.tr
                                key={row.id}
                                initial={{opacity: 0}}
                                animate={{opacity: 1}}
                                transition={{delay: index * 0.02}}
                                className="border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                            >
                                <td className="py-3 px-4 text-sm whitespace-nowrap">
                                    {formatDate(row.date)}
                                </td>
                                <td className="py-3 px-4 text-sm font-medium">
                                    {row.title}
                                </td>
                                <td className="py-3 px-4 text-sm">
                                    <span className="inline-block px-2 py-1 rounded-full bg-neutral-100 dark:bg-neutral-700 text-xs">
                                        {row.category}
                                    </span>
                                </td>
                                <td className="py-3 px-4 text-sm text-right font-medium text-red-600 dark:text-red-400">
                                    {row.sgaAmount > 0 ? formatCurrency(row.sgaAmount) : '—'}
                                </td>
                                <td className="py-3 px-4 text-sm text-right font-medium text-blue-600 dark:text-blue-400">
                                    {row.groupFundsAmount > 0 ? formatCurrency(row.groupFundsAmount) : '—'}
                                </td>
                                <td className="py-3 px-4 text-sm text-right font-bold">
                                    {row.totalCost > 0 ? formatCurrency(row.totalCost) : '—'}
                                </td>
                                <td className="py-3 px-4">
                                    <div className="flex items-center justify-center gap-2">
                                        {row.eventId && (
                                            <>
                                                <button
                                                    onClick={() => row.hasFinance ? onEditEvent(row.eventId!, row.finance) : (onCreateEvent ? onCreateEvent(row.eventId!) : onEditEvent(row.eventId!))}
                                                    className="inline-flex items-center gap-1 px-3 py-1 rounded text-xs font-medium transition-colors hover:bg-neutral-200 dark:hover:bg-neutral-700"
                                                    title={row.hasFinance ? 'Edit finance details' : 'Add finance details'}
                                                >
                                                    {row.hasFinance ? (
                                                        <>
                                                            <FaEdit/> Edit
                                                        </>
                                                    ) : (
                                                        <>
                                                            <FaPlus/> Add
                                                        </>
                                                    )}
                                                </button>
                                                {row.hasFinance && row.finance && onDeleteEvent && (
                                                    <button
                                                        onClick={() => handleDelete(row.finance!.id)}
                                                        className="inline-flex items-center gap-1 px-3 py-1 rounded text-xs font-medium text-red-600 dark:text-red-400 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20"
                                                        title="Delete finance entry"
                                                    >
                                                        <FaTrash/>
                                                    </button>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </td>
                            </motion.tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {filteredRows.length === 0 && (
                    <div className="text-center py-12 text-neutral-500 dark:text-neutral-400">
                        No events found matching your filters
                    </div>
                )}
            </div>
        </div>
    );
}