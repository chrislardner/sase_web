import type {AcademicYear, EventId, Quarter} from '@/app/calendar/types';

export type BudgetCategory = 'Travel' | 'Cultural Events' | 'Social/Service';

export interface CategoryBudget {
    category: BudgetCategory;
    allocated: number;
    sgaSpent: number;
    groupFundsSpent: number;
    totalSpent: number;
    remaining: number;
    isExceeded: boolean;
}

export const SGA_CATEGORY_ALLOCATIONS: Record<AcademicYear, Record<BudgetCategory, number>> = {
    '2025-2026': {
        'Travel': 2400,
        'Cultural Events': 3000,
        'Social/Service': 1850,
    },
    '2024-2025': {
        'Travel': 0,
        'Cultural Events': 0,
        'Social/Service': 0,
    },
    '2023-2024': {
        'Travel': 0,
        'Cultural Events': 0,
        'Social/Service': 0,
    },
    '2022-2023': {
        'Travel': 0,
        'Cultural Events': 0,
        'Social/Service': 0,
    },
};

export interface PurchaseItem {
    id: string;
    name: string;
    quantity: number;
    unitCost: number;
    totalCost: number;
    vendor?: string;
    notes?: string;
}

export interface FinanceEvent {
    id: string;
    eventId: EventId;

    purchases: PurchaseItem[];
    totalCost: number;

    category: BudgetCategory;
    sgaAmount: number;
    groupFundsAmount: number;

    attendeeCount?: number;
    costPerPerson?: number;
    notes?: string;
    isPaid: boolean;

    createdAt: string;
    updatedAt: string;
}

export interface PlannedEvent {
    id: string;
    title: string;
    date: string;
    quarter: Quarter;
    academicYear: AcademicYear;

    estimatedCost: number;
    category: BudgetCategory;
    sgaAmount: number;
    groupFundsAmount: number;

    expectedAttendees?: number;
    notes?: string;

    createdAt: string;
    updatedAt: string;
}

export interface BudgetPlan {
    id: string;
    name: string;
    academicYear: AcademicYear;
    isOfficial: boolean;

    actualEventIds: string[]; // FinanceEvent IDs
    plannedEventIds: string[]; // PlannedEvent IDs

    createdAt: string;
    updatedAt: string;
}

export interface BudgetSummary {
    academicYear: AcademicYear;

    sgaTotalAllocated: number;
    sgaTotalSpent: number;
    sgaTotalPlanned: number;
    sgaRemaining: number;

    groupFundsTotalSpent: number;
    groupFundsTotalPlanned: number;

    categories: CategoryBudget[];
}

export interface QuarterSummary {
    quarter: Quarter;
    academicYear: AcademicYear;
    sgaSpent: number;
    groupFundsSpent: number;
    eventCount: number;
    categoryBreakdown: Partial<Record<BudgetCategory, number>>;
}

export const CURRENT_ACADEMIC_YEAR: AcademicYear = '2025-2026';

export const BUDGET_CATEGORY_COLORS: Record<BudgetCategory, string> = {
    'Travel': 'rgb(225, 25, 25)', // Red
    'Cultural Events': 'rgb(128, 0, 0)', // Maroon
    'Social/Service': 'rgb(25, 125, 200)', // Blue
};

export interface APIResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

export interface SyncState {
    lastSyncedAt: string | null;
    isSyncing: boolean;
    error: string | null;
}
