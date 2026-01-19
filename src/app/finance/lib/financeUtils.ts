import type {EventItem} from '@/app/calendar/types';
import {AcademicYear, Quarter} from "@/app/calendar/types";
import type {BudgetCategory, BudgetSummary, CategoryBudget, FinanceEvent, PlannedEvent, QuarterSummary} from '../types/finance';
import {SGA_CATEGORY_ALLOCATIONS} from '../types/finance';

export function parseNumber(value: any): number {
    if (value === null || value === undefined) return 0;
    if (typeof value === 'number') return isNaN(value) ? 0 : value;
    if (typeof value === 'string') {
        const parsed = Number(value);
        return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
}

export function formatCurrency(amount: number | string | null | undefined): string {
    const num = parseNumber(amount);
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(num);
}

export function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    }).format(date);
}

export function formatQuarter(quarter: Quarter): string {
    return quarter.charAt(0).toUpperCase() + quarter.slice(1);
}
export function getQuarterFromDate(date: Date): Quarter {
    const month = date.getMonth(); // 0-11
    const day = date.getDate();

    // Fall: Aug 25 - Nov 22
    if ((month === 7 && day >= 25) || (month >= 8 && month <= 10) || (month === 10 && day <= 22)) {
        return 'fall';
    }

    // Winter: Nov 23 - Mar 7
    if ((month === 10 && day >= 23) || month === 11 || month === 0 || month === 1 || (month === 2 && day <= 7)) {
        return 'winter';
    }

    // Spring: Mar 8 - Jun
    return 'spring';
}

export function detectEventCategory(title: string): BudgetCategory {
    const lower = title.toLowerCase();

    if (lower.includes('national') || lower.includes('conference') ||
        lower.includes('travel') || lower.includes('flight') ||
        lower.includes('hotel') || lower.includes('airbnb')) {
        return 'Travel';
    }

    if (lower.includes('lunar new year') || lower.includes('mid-autumn') ||
        lower.includes('night market') || lower.includes('festival') ||
        lower.includes('cultural') || lower.includes('lantern')) {
        return 'Cultural Events';
    }
    return 'Social/Service';
}

export function calculateCategoryBudgets(
    academicYear: AcademicYear,
    financeEvents: FinanceEvent[],
    plannedEvents: PlannedEvent[]
): CategoryBudget[] {
    const allocations = SGA_CATEGORY_ALLOCATIONS[academicYear];
    if (!allocations) {
        return [];
    }

    const categories: BudgetCategory[] = ['Travel', 'Cultural Events', 'Social/Service'];

    return categories.map(category => {
        const allocated = parseNumber(allocations[category]);

        const categoryFinanceEvents = financeEvents.filter(
            e => e.category === category
        );

        const sgaSpent = categoryFinanceEvents.reduce(
            (sum, e) => sum + parseNumber(e.sgaAmount),
            0
        );

        const groupFundsSpent = categoryFinanceEvents.reduce(
            (sum, e) => sum + parseNumber(e.groupFundsAmount),
            0
        );

        const categoryPlannedEvents = plannedEvents.filter(
            e => e.category === category
        );

        const sgaPlanned = categoryPlannedEvents.reduce(
            (sum, e) => sum + parseNumber(e.sgaAmount),
            0
        );

        const totalSpent = sgaSpent + groupFundsSpent;

        const remaining = allocated - sgaSpent - sgaPlanned;
        const isExceeded = sgaSpent + sgaPlanned > allocated;

        return {
            category,
            allocated,
            sgaSpent,
            groupFundsSpent,
            totalSpent,
            remaining,
            isExceeded,
        };
    });
}

export function calculateBudgetSummary(
    academicYear: AcademicYear,
    financeEvents: FinanceEvent[],
    plannedEvents: PlannedEvent[]
): BudgetSummary {
    const categories = calculateCategoryBudgets(
        academicYear,
        financeEvents,
        plannedEvents
    );

    const sgaTotalAllocated = categories.reduce(
        (sum, c) => sum + parseNumber(c.allocated),
        0
    );

    const sgaTotalSpent = categories.reduce(
        (sum, c) => sum + parseNumber(c.sgaSpent),
        0
    );

    const groupFundsTotalSpent = categories.reduce(
        (sum, c) => sum + parseNumber(c.groupFundsSpent),
        0
    );

    const sgaTotalPlanned = plannedEvents.reduce(
        (sum, e) => sum + parseNumber(e.sgaAmount),
        0
    );

    const groupFundsTotalPlanned = plannedEvents.reduce(
        (sum, e) => sum + parseNumber(e.groupFundsAmount),
        0
    );

    const sgaRemaining = sgaTotalAllocated - sgaTotalSpent - sgaTotalPlanned;

    return {
        academicYear,
        sgaTotalAllocated,
        sgaTotalSpent,
        sgaTotalPlanned,
        sgaRemaining,
        groupFundsTotalSpent,
        groupFundsTotalPlanned,
        categories,
    };
}

export function calculateQuarterSummaries(
    academicYear: AcademicYear,
    financeEvents: FinanceEvent[],
    plannedEvents: PlannedEvent[],
    calendarEvents: EventItem[]
): QuarterSummary[] {
    const quarters: Quarter[] = ['fall', 'winter', 'spring'];

    return quarters.map(quarter => {
        const quarterEventIds = calendarEvents
            .filter(e => e.academicYear === academicYear && e.quarter === quarter)
            .map(e => e.id);

        const quarterFinanceEvents = financeEvents.filter(e =>
            quarterEventIds.includes(e.eventId)
        );

        const quarterPlannedEvents = plannedEvents.filter(
            e => e.academicYear === academicYear && e.quarter === quarter
        );

        const sgaSpent = quarterFinanceEvents.reduce(
            (sum, e) => sum + parseNumber(e.sgaAmount),
            0
        );

        const groupFundsSpent = quarterFinanceEvents.reduce(
            (sum, e) => sum + parseNumber(e.groupFundsAmount),
            0
        );

        const sgaPlanned = quarterPlannedEvents.reduce(
            (sum, e) => sum + parseNumber(e.sgaAmount),
            0
        );

        const groupFundsPlanned = quarterPlannedEvents.reduce(
            (sum, e) => sum + parseNumber(e.groupFundsAmount),
            0
        );

        const categoryBreakdown: Partial<Record<BudgetCategory, number>> = {};

        quarterFinanceEvents.forEach(e => {
            categoryBreakdown[e.category] =
                (categoryBreakdown[e.category] || 0) + parseNumber(e.totalCost);
        });

        quarterPlannedEvents.forEach(e => {
            categoryBreakdown[e.category] =
                (categoryBreakdown[e.category] || 0) + parseNumber(e.estimatedCost);
        });

        return {
            quarter,
            academicYear,
            sgaSpent: sgaSpent + sgaPlanned,
            groupFundsSpent: groupFundsSpent + groupFundsPlanned,
            eventCount: quarterFinanceEvents.length + quarterPlannedEvents.length,
            categoryBreakdown,
        };
    });
}
