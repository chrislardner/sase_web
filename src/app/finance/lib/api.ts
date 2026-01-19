import type {APIResponse, BudgetPlan, FinanceEvent, PlannedEvent,} from '../types/finance';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api/finance';

async function fetchAPI<T>(
    endpoint: string,
    options?: RequestInit
): Promise<T> {
    const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
        },
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({error: 'Network error'}));
        throw new Error(error.error || `API Error: ${response.status}`);
    }

    const result: APIResponse<T> = await response.json();

    if (!result.success) {
        throw new Error(result.error || 'API request failed');
    }

    return result.data as T;
}

export async function getFinanceEvents(academicYear: string): Promise<FinanceEvent[]> {
    return fetchAPI<FinanceEvent[]>(`/finance-events?year=${academicYear}`);
}

export async function createFinanceEvent(event: Omit<FinanceEvent, 'id' | 'createdAt' | 'updatedAt'>): Promise<FinanceEvent> {
    return fetchAPI<FinanceEvent>('/finance-events', {
        method: 'POST',
        body: JSON.stringify(event),
    });
}

export async function updateFinanceEvent(id: string, updates: Partial<FinanceEvent>): Promise<FinanceEvent> {
    return fetchAPI<FinanceEvent>(`/finance-events/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
    });
}

export async function deleteFinanceEvent(id: string): Promise<void> {
    return fetchAPI<void>(`/finance-events/${id}`, {
        method: 'DELETE',
    });
}

export async function getPlannedEvents(academicYear: string): Promise<PlannedEvent[]> {
    return fetchAPI<PlannedEvent[]>(`/planned-events?year=${academicYear}`);
}

export async function createPlannedEvent(event: Omit<PlannedEvent, 'id' | 'createdAt' | 'updatedAt'>): Promise<PlannedEvent> {
    return fetchAPI<PlannedEvent>('/planned-events', {
        method: 'POST',
        body: JSON.stringify(event),
    });
}

export async function updatePlannedEvent(id: string, updates: Partial<PlannedEvent>): Promise<PlannedEvent> {
    return fetchAPI<PlannedEvent>(`/planned-events/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
    });
}

export async function deletePlannedEvent(id: string): Promise<void> {
    return fetchAPI<void>(`/planned-events/${id}`, {
        method: 'DELETE',
    });
}
export async function getBudgetPlans(academicYear: string): Promise<BudgetPlan[]> {
    return fetchAPI<BudgetPlan[]>(`/budget-plans?year=${academicYear}`);
}

export async function createBudgetPlan(plan: Omit<BudgetPlan, 'id' | 'createdAt' | 'updatedAt'>): Promise<BudgetPlan> {
    return fetchAPI<BudgetPlan>('/budget-plans', {
        method: 'POST',
        body: JSON.stringify(plan),
    });
}

export async function updateBudgetPlan(id: string, updates: Partial<BudgetPlan>): Promise<BudgetPlan> {
    return fetchAPI<BudgetPlan>(`/budget-plans/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
    });
}

export async function deleteBudgetPlan(id: string): Promise<void> {
    return fetchAPI<void>(`/budget-plans/${id}`, {
        method: 'DELETE',
    });
}

export async function getOfficialPlan(academicYear: string): Promise<BudgetPlan | null> {
    const plans = await getBudgetPlans(academicYear);
    return plans.find(p => p.isOfficial) || null;
}
