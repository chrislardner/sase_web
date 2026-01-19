import type {EventItem} from '@/app/calendar/types';
import {AcademicYear, Quarter} from "@/app/calendar/types";
import type {
    BudgetCategory,
    BudgetSummary,
    CategoryBudget,
    FinanceEvent,
    PlannedEvent,
    QuarterSummary,
} from '../types/finance';
import {SGA_CATEGORY_ALLOCATIONS} from '../types/finance';

export function detectEventCategory(title: string): BudgetCategory {
    const lower = title.toLowerCase();

    if (lower.includes('national') || lower.includes('conference') ||
        lower.includes('travel') || lower.includes('flight') ||
        lower.includes('hotel') || lower.includes('airbnb')) {
        return 'Travel';
    }

    if (lower.includes('lunar new year') || lower.includes('midautumn') ||
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

    console.log(financeEvents, "financeEvents");
    console.log(plannedEvents, "plannedEvents");

    const categories: BudgetCategory[] = ['Travel', 'Cultural Events', 'Social/Service'];

    return categories.map(category => {
        const allocated = allocations[category];

        const categoryFinanceEvents = financeEvents.filter(e => e.category === category);
        const sgaSpent = categoryFinanceEvents.reduce((sum, e) => sum + e.sgaAmount, 0);
        const groupFundsSpent = categoryFinanceEvents.reduce((sum, e) => sum + e.groupFundsAmount, 0);

        const categoryPlannedEvents = plannedEvents.filter(e => e.category === category);
        const sgaPlanned = categoryPlannedEvents.reduce((sum, e) => sum + e.sgaAmount, 0);
        const groupFundsPlanned = categoryPlannedEvents.reduce((sum, e) => sum + e.groupFundsAmount, 0);

        const totalSpent = sgaSpent + groupFundsSpent;
        const totalPlanned = sgaPlanned + groupFundsPlanned;
        const totalWithPlanned = totalSpent + totalPlanned;

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
    const categories = calculateCategoryBudgets(academicYear, financeEvents, plannedEvents);

    const sgaTotalAllocated = categories.reduce((sum, c) => sum + c.allocated, 0);
    const sgaTotalSpent = categories.reduce((sum, c) => sum + c.sgaSpent, 0);
    const groupFundsTotalSpent = categories.reduce((sum, c) => sum + c.groupFundsSpent, 0);

    const sgaTotalPlanned = plannedEvents.reduce((sum, e) => sum + e.sgaAmount, 0);
    const groupFundsTotalPlanned = plannedEvents.reduce((sum, e) => sum + e.groupFundsAmount, 0);

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

        const quarterPlannedEvents = plannedEvents.filter(e =>
            e.academicYear === academicYear && e.quarter === quarter
        );

        const sgaSpent = quarterFinanceEvents.reduce((sum, e) => sum + e.sgaAmount, 0);
        const groupFundsSpent = quarterFinanceEvents.reduce((sum, e) => sum + e.groupFundsAmount, 0);

        const sgaPlanned = quarterPlannedEvents.reduce((sum, e) => sum + e.sgaAmount, 0);
        const groupFundsPlanned = quarterPlannedEvents.reduce((sum, e) => sum + e.groupFundsAmount, 0);

        const categoryBreakdown: Partial<Record<BudgetCategory, number>> = {};

        quarterFinanceEvents.forEach(e => {
            categoryBreakdown[e.category] = (categoryBreakdown[e.category] || 0) + e.totalCost;
        });

        quarterPlannedEvents.forEach(e => {
            categoryBreakdown[e.category] = (categoryBreakdown[e.category] || 0) + e.estimatedCost;
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

export function validateBudgetAllocation(
    category: BudgetCategory,
    sgaAmount: number,
    groupFundsAmount: number,
    academicYear: AcademicYear,
    existingEvents: FinanceEvent[],
    plannedEvents: PlannedEvent[],
    excludeEventId?: string
): {
    isValid: boolean;
    exceedsBy?: number;
    warning?: string;
} {
    const allocations = SGA_CATEGORY_ALLOCATIONS[academicYear];
    if (!allocations) {
        return {isValid: true};
    }

    const allocated = allocations[category];

    const currentSgaSpent = existingEvents
        .filter(e => e.category === category && e.id !== excludeEventId)
        .reduce((sum, e) => sum + e.sgaAmount, 0);

    const currentSgaPlanned = plannedEvents
        .filter(e => e.category === category && e.id !== excludeEventId)
        .reduce((sum, e) => sum + e.sgaAmount, 0);

    const newTotal = currentSgaSpent + currentSgaPlanned + sgaAmount;

    if (newTotal > allocated) {
        const exceedsBy = newTotal - allocated;
        return {
            isValid: false,
            exceedsBy,
            warning: `This would exceed the ${category} SGA budget by ${formatCurrency(exceedsBy)}. Consider using Group Funds for the excess.`,
        };
    }

    return {isValid: true};
}

export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
}

export function formatDate(isoString: string): string {
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    }).format(new Date(isoString));
}

export function formatQuarter(quarter: Quarter): string {
    return quarter.charAt(0).toUpperCase() + quarter.slice(1);
}

export function getQuarterFromDate(date: Date, academicYear: AcademicYear): Quarter {
    const month = date.getMonth(); // 0-11
    const day = date.getDate();

    // const [startYear] = academicYear.split('-').map(Number);

    if ((month === 7 && day >= 25) || (month >= 8 && month <= 10) || (month === 10 && day <= 22)) {
        return 'fall';
    }

    if ((month === 10 && day >= 23) || month === 11 || month === 0 || month === 1 || (month === 2 && day <= 7)) {
        return 'winter';
    }

    return 'spring';
}

export function sortByDate<T extends { date?: string; createdAt?: string }>(
    items: T[],
    ascending = true
): T[] {
    return [...items].sort((a, b) => {
        const dateA = new Date(a.date || a.createdAt || 0).getTime();
        const dateB = new Date(b.date || b.createdAt || 0).getTime();
        return ascending ? dateA - dateB : dateB - dateA;
    });
}
