import {useMemo, useState} from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import type {EventItem} from '@/app/calendar/types';
import type {BudgetCategory, FinanceEvent, PlannedEvent} from '../types/finance';
import {detectEventCategory, formatCurrency, formatDate, getQuarterFromDate} from '../lib/financeUtils';
import {FaChevronLeft, FaChevronRight, FaTimes, FaTrash} from 'react-icons/fa';
import {AcademicYear} from "@/app/calendar/types";


interface CalendarPlannerProps {
    academicYear: AcademicYear;
    calendarEvents: EventItem[];
    financeEvents: FinanceEvent[];
    plannedEvents: PlannedEvent[];
    onEditEvent: (eventId: string, finance?: FinanceEvent) => void;
    onAddPlanned: (event: Omit<PlannedEvent, 'id' | 'createdAt' | 'updatedAt'>) => Promise<PlannedEvent>;
    onDeletePlanned: (id: string) => Promise<void>;
}

export function CalendarPlanner({
                                    academicYear,
                                    calendarEvents,
                                    financeEvents,
                                    plannedEvents,
                                    onEditEvent,
                                    onAddPlanned,
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

                        const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
                        const dayEvents = eventsByDate.get(dateKey) || [];
                        const isToday = new Date().toDateString() === date.toDateString();

                        return (
                            <button
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
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onEditEvent(event.id, finance);
                                            }}
                                            className="text-xs p-1 rounded bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-900/50 cursor-pointer"
                                        >
                                            <div className="font-medium truncate">{event.oneWordTitle}</div>
                                            {finance && (
                                                <div className="text-[10px] font-bold">
                                                    ${finance.totalCost.toFixed(0)}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </button>
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
        </div>
    );
}
