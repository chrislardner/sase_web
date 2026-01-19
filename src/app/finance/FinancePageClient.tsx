'use client';

import {useState} from 'react';
import {motion} from 'framer-motion';
import {useEvents} from '@/app/calendar/useEvents';
import type {FinanceEvent} from './types/finance';
import {CURRENT_ACADEMIC_YEAR} from './types/finance';
import {useFinanceData} from './lib/useFinanceData';
import {BudgetOverview} from '@/app/finance/components';
import {CalendarPlanner} from '@/app/finance/components';
import {EventsTable} from '@/app/finance/components';
import {EventFinanceModal} from '@/app/finance/components';
import {AcademicYear} from "@/app/calendar/types";

type Tab = 'budget' | 'calendar' | 'events';

interface FinancePageClientProps {
    userEmail: string;
}

export default function FinancePageClient({  }: FinancePageClientProps) {
    const {events: calendarEvents} = useEvents();
    const [selectedYear, setSelectedYear] = useState<AcademicYear>(CURRENT_ACADEMIC_YEAR);
    const [activeTab, setActiveTab] = useState<Tab>('budget');
    const [modalState, setModalState] = useState<{
        isOpen: boolean;
        eventId: string | null;
        existingFinance?: FinanceEvent;
    }>({
        isOpen: false,
        eventId: null,
    });

    const {
        financeEvents,
        plannedEvents,
        syncState,
        createFinanceEvent,
        updateFinanceEvent,
        createPlannedEvent,
        deletePlannedEvent,
    } = useFinanceData(selectedYear);

    const availableYears: AcademicYear[] = [
        '2025-2026',
        '2024-2025',
        '2023-2024',
        '2022-2023',
    ];

    const tabs: { id: Tab; label: string }[] = [
        {id: 'budget', label: 'Budget Overview'},
        {id: 'calendar', label: 'Calendar & Planner'},
        {id: 'events', label: 'All Events'},
    ];

    const handleEditEvent = (eventId: string, finance?: FinanceEvent) => {
        setModalState({
            isOpen: true,
            eventId,
            existingFinance: finance,
        });
    };

    const handleSaveFinance = async (financeData: Omit<FinanceEvent, 'id' | 'createdAt' | 'updatedAt'>) => {
        if (modalState.existingFinance) {
            await updateFinanceEvent(modalState.existingFinance.id, financeData);
        } else {
            await createFinanceEvent(financeData);
        }
    };

    const selectedEvent = calendarEvents.find(e => e.id === modalState.eventId);

    return (
        <main>
            <section className="relative overflow-hidden bg-rhit-maroon-soft dark:bg-rhit-maroon">
                <div className="relative max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.6}}
                        className="text-center"
                    >
                        <h1 className="text-3xl md:text-5xl font-bold text-neutral-50">
                            Finance Dashboard
                        </h1>
                        <p className="mt-4 text-lg text-neutral-200 max-w-2xl mx-auto">
                            Track budgets, manage spending, and plan events by category
                        </p>

                        <div className="flex justify-center mt-8">
                            <motion.div
                                initial={{width: 0, opacity: 0}}
                                animate={{width: '36rem', opacity: 1}}
                                transition={{duration: 0.6, ease: 'easeOut'}}
                            >
                                <div className="h-1 w-full rounded-full bg-neutral-50"/>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </section>

            <section
                className="border-b border-neutral-200 dark:border-neutral-800 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm sticky top-16 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-3">
                            <label className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                                Academic Year:
                            </label>
                            <select
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(e.target.value as AcademicYear)}
                                className="px-4 py-2 border rounded-lg bg-white dark:bg-neutral-800 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-rhit-maroon"
                            >
                                {availableYears.map(year => (
                                    <option key={year} value={year}>
                                        {year}
                                        {year === CURRENT_ACADEMIC_YEAR && ' (Current)'}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {syncState.isSyncing && (
                            <span className="text-sm text-neutral-500">Syncing...</span>
                        )}

                        {syncState.error && (
                            <span className="text-sm text-red-600">Error: {syncState.error}</span>
                        )}
                    </div>
                </div>
            </section>

            <section
                className="border-b border-neutral-200 dark:border-neutral-800 sticky top-[136px] bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex space-x-8 overflow-x-auto">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                  py-4 px-2 border-b-2 font-medium text-sm transition-colors whitespace-nowrap
                  ${activeTab === tab.id
                                    ? 'border-rhit-maroon text-rhit-maroon dark:border-red-400 dark:text-red-400'
                                    : 'border-transparent text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300'}
                `}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            <section className="page-shell">
                <motion.div
                    key={`${activeTab}-${selectedYear}`}
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.3}}
                >
                    {activeTab === 'budget' && (
                        <BudgetOverview
                            academicYear={selectedYear}
                            calendarEvents={calendarEvents}
                            financeEvents={financeEvents}
                            plannedEvents={plannedEvents}
                        />
                    )}

                    {activeTab === 'calendar' && (
                        <CalendarPlanner
                            academicYear={selectedYear}
                            calendarEvents={calendarEvents}
                            financeEvents={financeEvents}
                            plannedEvents={plannedEvents}
                            onEditEvent={handleEditEvent}
                            onAddPlanned={createPlannedEvent}
                            onDeletePlanned={deletePlannedEvent}
                        />
                    )}

                    {activeTab === 'events' && (
                        <EventsTable
                            academicYear={selectedYear}
                            calendarEvents={calendarEvents}
                            financeEvents={financeEvents}
                            plannedEvents={plannedEvents}
                            onEditEvent={handleEditEvent}
                        />
                    )}
                </motion.div>
            </section>

            {selectedEvent && (
                <EventFinanceModal
                    event={selectedEvent}
                    existingFinance={modalState.existingFinance}
                    academicYear={selectedYear}
                    allFinanceEvents={financeEvents}
                    allPlannedEvents={plannedEvents}
                    isOpen={modalState.isOpen}
                    onClose={() => setModalState({isOpen: false, eventId: null})}
                    onSave={handleSaveFinance}
                />
            )}
        </main>
    );
}