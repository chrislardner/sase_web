import {useMemo, useState} from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import type {EventItem} from '@/app/calendar/types';
import {AcademicYear} from "@/app/calendar/types";
import type {BudgetCategory, FinanceEvent, PlannedEvent} from '../types/finance';
import {detectEventCategory, formatCurrency, formatDate, getQuarterFromDate} from '../lib/financeUtils';
import {FaChevronLeft, FaChevronRight, FaEdit, FaPlus, FaTimes, FaTrash} from 'react-icons/fa';
import {PlannedEventModal} from "@/app/finance/components/PlannedEventModal";


interface CalendarPlannerProps {
    academicYear: AcademicYear;
    calendarEvents: EventItem[];
    financeEvents: FinanceEvent[];
    plannedEvents: PlannedEvent[];
    onEditEvent: (eventId: string, finance?: FinanceEvent) => void;
    onEditFinance: (id: string, finance: FinanceEvent) => void;
    onDeleteFinance: (id: string) => Promise<void>;
    onAddPlanned: (event: Omit<PlannedEvent, 'id' | 'createdAt' | 'updatedAt'>) => Promise<PlannedEvent>;
    onUpdatePlanned: (id: string, updates: Partial<PlannedEvent>) => Promise<PlannedEvent>;
    onDeletePlanned: (id: string) => Promise<void>;
}

export function CalendarPlanner({
                                    academicYear,
                                    calendarEvents,
                                    financeEvents,
                                    plannedEvents,
                                    onEditEvent,
                                    onEditFinance,
                                    onDeleteFinance,
                                    onAddPlanned,
                                    onUpdatePlanned,
                                    onDeletePlanned,
                                }: CalendarPlannerProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [isAddingPlanned, setIsAddingPlanned] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [newPlanned, setNewPlanned] = useState({
        title: '',
        estimatedCost: '',
        category: 'Social/Service' as BudgetCategory,
        sgaAmount: '',
        groupFundsAmount: '',
        notes: '',
    });
    const [plannedModalState, setPlannedModalState] = useState<{
        isOpen: boolean;
        event?: PlannedEvent;
    }>({isOpen: false});

    const calendarGrid = useMemo(() => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startingDayOfWeek = firstDay.getDay();
        const daysInMonth = lastDay.getDate();

        const days: (Date | null)[] = [];

        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            days.push(new Date(year, month, day));
        }

        return days;
    }, [currentMonth]);

    const eventsByDate = useMemo(() => {
        const map = new Map<string, Array<{ event: EventItem; finance?: FinanceEvent }>>();

        calendarEvents
            .filter(e => e.academicYear === academicYear)
            .forEach(event => {
                const date = new Date(event.startsAt);
                const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

                if (!map.has(key)) map.set(key, []);

                const finance = financeEvents.find(f => f.eventId === event.id);
                map.get(key)!.push({event, finance});
            });

        return map;
    }, [calendarEvents, financeEvents, academicYear]);

    const handlePrevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    };

    const handleNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    };

    const handleDateClick = (date: Date) => {
        setSelectedDate(date);
        setIsAddingPlanned(true);

        // const quarter = getQuarterFromDate(date, academicYear);
        const category = detectEventCategory('');

        setNewPlanned(prev => ({
            ...prev,
            category,
        }));
    };

    const handleAddPlanned = async () => {
        if (!selectedDate || !newPlanned.title || !newPlanned.estimatedCost) return;

        try {
            await onAddPlanned({
                title: newPlanned.title,
                date: selectedDate.toISOString().split('T')[0],
                quarter: getQuarterFromDate(selectedDate, academicYear),
                academicYear,
                estimatedCost: parseFloat(newPlanned.estimatedCost),
                category: newPlanned.category,
                sgaAmount: parseFloat(newPlanned.sgaAmount) || 0,
                groupFundsAmount: parseFloat(newPlanned.groupFundsAmount) || 0,
                notes: newPlanned.notes || undefined,
            });

            setNewPlanned({
                title: '',
                estimatedCost: '',
                category: 'Social/Service',
                sgaAmount: '',
                groupFundsAmount: '',
                notes: '',
            });
            setIsAddingPlanned(false);
            setSelectedDate(null);
        } catch (error) {
            alert('Failed to add planned event');
        }
    };

    const monthName = currentMonth.toLocaleDateString('en-US', {month: 'long', year: 'numeric'});
    const yearPlanned = plannedEvents.filter(pe => pe.academicYear === academicYear);

    return (
        <div className="space-y-8">
            <div>
                <h2 className="h2-title">Calendar & Event Planner - {academicYear}</h2>
                <p className="lead">View events and plan future spending</p>
            </div>

            <div className="card card-body">
                <div className="flex items-center justify-between mb-6">
                    <button onClick={handlePrevMonth} className="btn-icon">
                        <FaChevronLeft/>
                    </button>
                    <h3 className="text-xl font-bold">{monthName}</h3>
                    <button onClick={handleNextMonth} className="btn-icon">
                        <FaChevronRight/>
                    </button>
                </div>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Calendar Planning</h2>
                    <button
                        onClick={() => setPlannedModalState({isOpen: true})}
                        className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                    >
                        <FaPlus/>
                        Add Planned Event
                    </button>
                </div>

                <div className="grid grid-cols-7 gap-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day}
                             className="text-center text-xs font-medium py-2 text-neutral-600 dark:text-neutral-400">
                            {day}
                        </div>
                    ))}

                    {calendarGrid.map((date, index) => {
                        if (!date) {
                            return <div key={`empty-${index}`} className="min-h-[100px]"/>;
                        }

                        const dayKey = date.toISOString().split('T')[0];
                        const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
                        const dayEvents = eventsByDate.get(dateKey) || [];
                        const isToday = new Date().toDateString() === date.toDateString();

                        return (
                            <div
                                key={dateKey}
                                onClick={() => handleDateClick(date)}
                                className={`min-h-[100px] p-2 rounded-lg border transition-all text-left ${
                                    isToday
                                        ? 'border-2 border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                        : 'border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                                }`}
                            >
                                <div className="text-sm font-medium mb-2">{date.getDate()}</div>

                                <div className="space-y-1">
                                    {dayEvents.map(({event, finance}) => (
                                        <div
                                            key={event.id}
                                            className="group relative text-xs p-2 mb-1 rounded bg-blue-100 dark:bg-blue-900/30 border-l-2 border-blue-500 hover:bg-blue-200 dark:hover:bg-blue-800/40 transition-colors cursor-pointer"
                                        >
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex-1">
                                                    <div
                                                        className="font-medium text-blue-900 dark:text-blue-100">{event.oneWordTitle}</div>
                                                    {finance && finance.totalCost != null && (
                                                        <div className="text-blue-700 dark:text-blue-300 text-xs">
                                                            ${Number(finance.totalCost).toFixed(2)} spent
                                                        </div>
                                                    )}
                                                </div>
                                                <div
                                                    className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {finance && <>
                                                        <button onClick={e => {
                                                            e.stopPropagation();
                                                            onEditEvent(event.id, finance);
                                                        }}
                                                                className="p-1 hover:bg-blue-300 dark:hover:bg-blue-700 rounded"
                                                                title="Edit">
                                                            <FaEdit className="w-3 h-3"/>
                                                        </button>
                                                        <button onClick={e => {
                                                            e.stopPropagation();
                                                            if (confirm(`Delete finance record for "${event.oneWordTitle}"?`)) onDeleteFinance(finance.id);
                                                        }}
                                                                className="p-1 hover:bg-red-200 dark:hover:bg-red-800 rounded text-red-600 dark:text-red-400"
                                                                title="Delete">
                                                            <FaTrash className="w-3 h-3"/>
                                                        </button>
                                                    </>}
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {plannedEvents
                                        .filter(pe => new Date(pe.date).toDateString() === date.toDateString())
                                        .map(plannedEvent => (
                                            <div
                                                key={plannedEvent.id}
                                                className="group relative text-xs p-2 mb-1 rounded bg-yellow-100 dark:bg-yellow-900/30 border-l-2 border-yellow-500 hover:bg-yellow-200 dark:hover:bg-yellow-800/40 transition-colors cursor-pointer"
                                            >
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="flex-1">
                                                        <div
                                                            className="font-medium text-yellow-900 dark:text-yellow-100">
                                                            {plannedEvent.title}
                                                        </div>
                                                        <div className="text-yellow-700 dark:text-yellow-300 text-xs">
                                                            ${Number(plannedEvent.estimatedCost).toFixed(2)} planned
                                                        </div>
                                                    </div>
                                                    <div
                                                        className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setPlannedModalState({
                                                                    isOpen: true,
                                                                    event: plannedEvent
                                                                });
                                                            }}
                                                            className="p-1 hover:bg-yellow-300 dark:hover:bg-yellow-700 rounded"
                                                            title="Edit planned event"
                                                        >
                                                            <FaEdit className="w-3 h-3"/>
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                if (confirm(`Delete planned event "${plannedEvent.title}"?`)) {
                                                                    onDeletePlanned(plannedEvent.id);
                                                                }
                                                            }}
                                                            className="p-1 hover:bg-red-200 dark:hover:bg-red-800 rounded text-red-600 dark:text-red-400"
                                                            title="Delete planned event"
                                                        >
                                                            <FaTrash className="w-3 h-3"/>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <AnimatePresence>
                {isAddingPlanned && selectedDate && (
                    <>
                        <motion.div
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            exit={{opacity: 0}}
                            onClick={() => setIsAddingPlanned(false)}
                            className="fixed inset-0 bg-black/50 z-50"
                        />

                        <motion.div
                            initial={{opacity: 0, scale: 0.95}}
                            animate={{opacity: 1, scale: 1}}
                            exit={{opacity: 0, scale: 0.95}}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
                        >
                            <div className="card card-body max-w-2xl w-full pointer-events-auto">
                                <div className="flex items-start justify-between mb-6">
                                    <div>
                                        <h3 className="text-xl font-bold">Add Planned Event</h3>
                                        <p className="text-sm card-subtle">{formatDate(selectedDate.toISOString())}</p>
                                    </div>
                                    <button onClick={() => setIsAddingPlanned(false)} className="btn-icon">
                                        <FaTimes/>
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Event Title *</label>
                                        <input
                                            type="text"
                                            value={newPlanned.title}
                                            onChange={(e) => setNewPlanned({...newPlanned, title: e.target.value})}
                                            className="w-full px-4 py-2 border rounded-lg dark:bg-neutral-800 dark:border-neutral-700"
                                            placeholder="e.g., Spring Festival"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Category</label>
                                            <select
                                                value={newPlanned.category}
                                                onChange={(e) => setNewPlanned({
                                                    ...newPlanned,
                                                    category: e.target.value as BudgetCategory
                                                })}
                                                className="w-full px-4 py-2 border rounded-lg dark:bg-neutral-800 dark:border-neutral-700"
                                            >
                                                <option value="Travel">Travel</option>
                                                <option value="Cultural Events">Cultural Events</option>
                                                <option value="Social/Service">Social/Service</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-2">Estimated Cost *</label>
                                            <input
                                                type="number"
                                                value={newPlanned.estimatedCost}
                                                onChange={(e) => setNewPlanned({
                                                    ...newPlanned,
                                                    estimatedCost: e.target.value
                                                })}
                                                className="w-full px-4 py-2 border rounded-lg dark:bg-neutral-800 dark:border-neutral-700"
                                                placeholder="0.00"
                                                step="0.01"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">SGA Amount</label>
                                            <input
                                                type="number"
                                                value={newPlanned.sgaAmount}
                                                onChange={(e) => setNewPlanned({
                                                    ...newPlanned,
                                                    sgaAmount: e.target.value
                                                })}
                                                className="w-full px-4 py-2 border rounded-lg dark:bg-neutral-800 dark:border-neutral-700"
                                                placeholder="0.00"
                                                step="0.01"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-2">Group Funds Amount</label>
                                            <input
                                                type="number"
                                                value={newPlanned.groupFundsAmount}
                                                onChange={(e) => setNewPlanned({
                                                    ...newPlanned,
                                                    groupFundsAmount: e.target.value
                                                })}
                                                className="w-full px-4 py-2 border rounded-lg dark:bg-neutral-800 dark:border-neutral-700"
                                                placeholder="0.00"
                                                step="0.01"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">Notes</label>
                                        <textarea
                                            value={newPlanned.notes}
                                            onChange={(e) => setNewPlanned({...newPlanned, notes: e.target.value})}
                                            className="w-full px-4 py-2 border rounded-lg dark:bg-neutral-800 dark:border-neutral-700"
                                            rows={3}
                                            placeholder="Optional notes..."
                                        />
                                    </div>

                                    <div className="flex justify-end gap-3">
                                        <button
                                            onClick={() => setIsAddingPlanned(false)}
                                            className="btn bg-neutral-200 dark:bg-neutral-700"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleAddPlanned}
                                            className="btn btn-accent"
                                            disabled={!newPlanned.title || !newPlanned.estimatedCost}
                                        >
                                            Add Planned Event
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <div className="card card-body">
                <h3 className="font-bold text-lg mb-4">Planned Events ({yearPlanned.length})</h3>

                {yearPlanned.length === 0 ? (
                    <div className="text-center py-8 text-neutral-500 dark:text-neutral-400">
                        No planned events yet. Click a date on the calendar to add one.
                    </div>
                ) : (
                    <div className="space-y-3">
                        {yearPlanned
                            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                            .map((event) => (
                                <div
                                    key={event.id}
                                    className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg"
                                >
                                    <div className="flex-1">
                                        <div className="font-medium">{event.title}</div>
                                        <div className="text-sm card-subtle">
                                            {formatDate(event.date)} • {event.category}
                                        </div>
                                        <div className="text-sm mt-1">
                                            <span
                                                className="text-red-600 dark:text-red-400">SGA: {formatCurrency(event.sgaAmount)}</span>
                                            {event.groupFundsAmount > 0 && (
                                                <span className="ml-3 text-blue-600 dark:text-blue-400">
                          Group Funds: {formatCurrency(event.groupFundsAmount)}
                        </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <div className="font-bold">{formatCurrency(event.estimatedCost)}</div>
                                        </div>
                                        <button
                                            onClick={e => {
                                                e.stopPropagation();
                                                setPlannedModalState({isOpen: true, event: event});
                                            }}
                                            className="p-1 hover:bg-yellow-300 dark:hover:bg-yellow-700 rounded"
                                            title="Edit"
                                        >
                                            <FaEdit className="w-3 h-3"/>
                                        </button>
                                        <button
                                            onClick={() => onDeletePlanned(event.id)}
                                            className="text-red-600 hover:text-red-700 dark:text-red-400"
                                        >
                                            <FaTrash/>
                                        </button>
                                    </div>
                                </div>
                            ))}
                    </div>
                )}
            </div>
            <PlannedEventModal
                isOpen={plannedModalState.isOpen}
                onClose={() => setPlannedModalState({isOpen: false})}
                onSave={async (data) => {
                    if (plannedModalState.event) {
                        await onUpdatePlanned(plannedModalState.event.id, data);
                    } else {
                        await onAddPlanned(data);
                    }
                    setPlannedModalState({isOpen: false});
                }}
                existingEvent={plannedModalState.event}
                academicYear={academicYear}
            />
        </div>
    );
}
