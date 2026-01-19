import {useMemo} from 'react';
import {motion} from 'framer-motion';
import type {EventItem} from '@/app/calendar/types';
import type {FinanceEvent, PlannedEvent} from '../types/finance';
import {BUDGET_CATEGORY_COLORS} from '../types/finance';
import {calculateBudgetSummary, calculateQuarterSummaries, formatCurrency, formatQuarter} from '../lib/financeUtils';
import {AcademicYear} from "@/app/calendar/types";

interface BudgetOverviewProps {
    academicYear: AcademicYear;
    calendarEvents: EventItem[];
    financeEvents: FinanceEvent[];
    plannedEvents: PlannedEvent[];
}

export function BudgetOverview({
                                   academicYear,
                                   calendarEvents,
                                   financeEvents,
                                   plannedEvents,
                               }: BudgetOverviewProps) {
    const summary = useMemo(
        () => calculateBudgetSummary(academicYear, financeEvents, plannedEvents),
        [academicYear, financeEvents, plannedEvents]
    );

    const quarterSummaries = useMemo(
        () => calculateQuarterSummaries(academicYear, financeEvents, plannedEvents, calendarEvents),
        [academicYear, financeEvents, plannedEvents, calendarEvents]
    );

    const sgaPercentUsed = summary.sgaTotalAllocated > 0
        ? ((summary.sgaTotalSpent + summary.sgaTotalPlanned) / summary.sgaTotalAllocated) * 100
        : 0;

    const getStatusColor = (percent: number) => {
        if (percent >= 100) return 'text-red-600 dark:text-red-400';
        if (percent >= 80) return 'text-yellow-600 dark:text-yellow-400';
        return 'text-green-600 dark:text-green-400';
    };

    return (
        <div className="space-y-8">
            <div>
                <h2 className="h2-title">Budget Overview - {academicYear}</h2>
                <p className="lead">SGA budget allocation by category and spending summary</p>
            </div>

            <motion.div
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                className="card card-body"
            >
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <h3 className="text-2xl font-bold">Total SGA Budget</h3>
                        <p className="text-sm card-subtle mt-1">All categories combined</p>
                    </div>
                    <div className={`text-right ${getStatusColor(sgaPercentUsed)}`}>
                        <div className="text-3xl font-bold">{sgaPercentUsed.toFixed(1)}%</div>
                        <div className="text-sm font-medium">Used</div>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                    <div className="text-center">
                        <div className="text-sm card-subtle uppercase tracking-wide">Allocated</div>
                        <div className="text-2xl font-bold mt-1">{formatCurrency(summary.sgaTotalAllocated)}</div>
                    </div>
                    <div className="text-center">
                        <div className="text-sm card-subtle uppercase tracking-wide">Actual Spent</div>
                        <div className="text-2xl font-bold mt-1 text-red-600 dark:text-red-400">
                            {formatCurrency(summary.sgaTotalSpent)}
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-sm card-subtle uppercase tracking-wide">Planned</div>
                        <div className="text-2xl font-bold mt-1 text-yellow-600 dark:text-yellow-400">
                            {formatCurrency(summary.sgaTotalPlanned)}
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-sm card-subtle uppercase tracking-wide">Remaining</div>
                        <div className={`text-2xl font-bold mt-1 ${getStatusColor(sgaPercentUsed)}`}>
                            {formatCurrency(summary.sgaRemaining)}
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between text-sm" onClick={() => console.log(summary)}>
                        <span className="card-subtle">Overall Budget Usage</span>
                        <span className="font-medium">
              {formatCurrency(summary.sgaTotalSpent + summary.sgaTotalPlanned)} of {formatCurrency(summary.sgaTotalAllocated)}
            </span>
                    </div>
                    <div
                        className="relative w-full bg-neutral-200 dark:bg-neutral-800 rounded-full h-4 overflow-hidden">
                        <motion.div
                            initial={{width: 0}}
                            animate={{width: `${Math.min((summary.sgaTotalSpent / summary.sgaTotalAllocated) * 100, 100)}%`}}
                            transition={{duration: 0.8, delay: 0.2}}
                            className="absolute left-0 top-0 h-full bg-red-600 dark:bg-red-500"
                        />
                        <motion.div
                            initial={{width: 0}}
                            animate={{width: `${Math.min(sgaPercentUsed, 100)}%`}}
                            transition={{duration: 0.8, delay: 0.4}}
                            className="absolute left-0 top-0 h-full bg-yellow-500 dark:bg-yellow-400 opacity-70"
                        />
                    </div>
                    <div className="flex justify-between text-xs">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded bg-red-600 dark:bg-red-500"/>
                            <span>Actual</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded bg-yellow-500 dark:bg-yellow-400"/>
                            <span>Planned</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded bg-neutral-200 dark:bg-neutral-800"/>
                            <span>Free</span>
                        </div>
                    </div>
                </div>

                {summary.sgaRemaining < 0 && (
                    <div
                        className="mt-4 p-4 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800">
                        <p className="text-sm text-red-700 dark:text-red-400 font-medium">
                            WARNING: Budget exceeded by {formatCurrency(Math.abs(summary.sgaRemaining))}
                        </p>
                    </div>
                )}
            </motion.div>

            <div>
                <h3 className="text-xl font-bold mb-4">By Category</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {summary.categories.map((cat, index) => {
                        const percentUsed = cat.allocated > 0 ? ((cat.sgaSpent / cat.allocated) * 100) : 0;

                        return (
                            <motion.div
                                key={cat.category}
                                initial={{opacity: 0, y: 20}}
                                animate={{opacity: 1, y: 0}}
                                transition={{delay: 0.1 + index * 0.1}}
                                className={`card card-body ${cat.isExceeded ? 'border-2 border-red-500' : ''}`}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h4 className="font-bold text-lg">{cat.category}</h4>
                                        {cat.isExceeded && (
                                            <span className="text-xs text-red-600 dark:text-red-400 font-medium">
                        WARNING: Exceeded
                      </span>
                                        )}
                                    </div>
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{backgroundColor: BUDGET_CATEGORY_COLORS[cat.category]}}
                                    />
                                </div>

                                <div className="space-y-3">
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="card-subtle">SGA Allocated</span>
                                            <span className="font-bold">{formatCurrency(cat.allocated)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="card-subtle">SGA Spent</span>
                                            <span className="font-medium text-red-600 dark:text-red-400">
                        {formatCurrency(cat.sgaSpent)}
                      </span>
                                        </div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="card-subtle">Group Funds</span>
                                            <span className="font-medium text-blue-600 dark:text-blue-400">
                        {formatCurrency(cat.groupFundsSpent)}
                      </span>
                                        </div>
                                        <div
                                            className="flex justify-between text-sm font-bold border-t pt-2 mt-2 border-neutral-200 dark:border-neutral-700">
                                            <span>Total Spent</span>
                                            <span>{formatCurrency(cat.totalSpent)}</span>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="card-subtle">SGA Usage</span>
                                            <span
                                                className={getStatusColor(percentUsed)}>{percentUsed.toFixed(0)}%</span>
                                        </div>
                                        <div className="w-full bg-neutral-200 dark:bg-neutral-800 rounded-full h-2">
                                            <div
                                                className={`h-full rounded-full transition-all duration-500 ${
                                                    percentUsed >= 100 ? 'bg-red-600' : 'bg-gradient-to-r from-rhit-maroon to-red-700'
                                                }`}
                                                style={{width: `${Math.min(percentUsed, 100)}%`}}
                                            />
                                        </div>
                                    </div>

                                    <div
                                        className={`text-sm font-medium ${cat.isExceeded ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                                        {cat.isExceeded
                                            ? `Over by ${formatCurrency(Math.abs(cat.remaining))}`
                                            : `${formatCurrency(cat.remaining)} remaining`
                                        }
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            <motion.div
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{delay: 0.4}}
                className="card card-body"
            >
                <div>
                    <h3 className="text-2xl font-bold">Group Funds</h3>
                    <p className="text-sm card-subtle mt-1">Supplementary budget (balance unknown)</p>
                </div>

                <div className="grid grid-cols-2 gap-6 mt-6">
                    <div className="text-center">
                        <div className="text-sm card-subtle uppercase tracking-wide">Actual Spent</div>
                        <div className="text-2xl font-bold mt-1 text-blue-600 dark:text-blue-400">
                            {formatCurrency(summary.groupFundsTotalSpent)}
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-sm card-subtle uppercase tracking-wide">Planned</div>
                        <div className="text-2xl font-bold mt-1 text-blue-600 dark:text-blue-400">
                            {formatCurrency(summary.groupFundsTotalPlanned)}
                        </div>
                    </div>
                </div>
            </motion.div>

            <div>
                <h3 className="text-xl font-bold mb-4">By Quarter</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {quarterSummaries.map((quarter, index) => (
                        <motion.div
                            key={quarter.quarter}
                            initial={{opacity: 0, y: 20}}
                            animate={{opacity: 1, y: 0}}
                            transition={{delay: 0.5 + index * 0.1}}
                            className="card card-body"
                        >
                            <h4 className="font-bold text-lg capitalize mb-4">{formatQuarter(quarter.quarter)}</h4>

                            <div className="space-y-3">
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="card-subtle">SGA</span>
                                        <span className="font-medium">{formatCurrency(quarter.sgaSpent)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="card-subtle">Group Funds</span>
                                        <span className="font-medium">{formatCurrency(quarter.groupFundsSpent)}</span>
                                    </div>
                                    <div className="text-xs card-subtle mt-2">
                                        {quarter.eventCount} events
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
