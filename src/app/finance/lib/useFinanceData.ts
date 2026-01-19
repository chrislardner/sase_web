'use client';

import {useCallback, useEffect, useState} from 'react';
import type {BudgetPlan, FinanceEvent, PlannedEvent, SyncState,} from '../types/finance';
import * as api from '../lib/api';
import {AcademicYear} from "@/app/calendar/types";

export function useFinanceData(academicYear: AcademicYear) {
    const [financeEvents, setFinanceEvents] = useState<FinanceEvent[]>([]);
    const [plannedEvents, setPlannedEvents] = useState<PlannedEvent[]>([]);
    const [budgetPlans, setBudgetPlans] = useState<BudgetPlan[]>([]);
    const [syncState, setSyncState] = useState<SyncState>({
        lastSyncedAt: null,
        isSyncing: false,
        error: null,
    });

    const loadData = useCallback(async () => {
        setSyncState(prev => ({...prev, isSyncing: true, error: null}));

        try {
            const [finance, planned, plans] = await Promise.all([
                api.getFinanceEvents(academicYear),
                api.getPlannedEvents(academicYear),
                api.getBudgetPlans(academicYear),
            ]);

            setFinanceEvents(finance);
            setPlannedEvents(planned);
            setBudgetPlans(plans);

            setSyncState({
                lastSyncedAt: new Date().toISOString(),
                isSyncing: false,
                error: null,
            });
        } catch (error) {
            console.error('Failed to load finance data:', error);
            setSyncState({
                lastSyncedAt: null,
                isSyncing: false,
                error: error instanceof Error ? error.message : 'Failed to load data',
            });
        }
    }, [academicYear]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const createFinanceEvent = useCallback(async (
        event: Omit<FinanceEvent, 'id' | 'createdAt' | 'updatedAt'>
    ) => {
        try {
            const created = await api.createFinanceEvent(event);
            setFinanceEvents(prev => [...prev, created]);
            return created;
        } catch (error) {
            console.error('Failed to create finance event:', error);
            throw error;
        }
    }, []);

    const updateFinanceEvent = useCallback(async (
        id: string,
        updates: Partial<FinanceEvent>
    ) => {
        try {
            const updated = await api.updateFinanceEvent(id, updates);
            setFinanceEvents(prev => prev.map(e => e.id === id ? updated : e));
            return updated;
        } catch (error) {
            console.error('Failed to update finance event:', error);
            throw error;
        }
    }, []);

    const deleteFinanceEvent = useCallback(async (id: string) => {
        try {
            await api.deleteFinanceEvent(id);
            setFinanceEvents(prev => prev.filter(e => e.id !== id));
        } catch (error) {
            console.error('Failed to delete finance event:', error);
            throw error;
        }
    }, []);

    const createPlannedEvent = useCallback(async (
        event: Omit<PlannedEvent, 'id' | 'createdAt' | 'updatedAt'>
    ) => {
        try {
            const created = await api.createPlannedEvent(event);
            setPlannedEvents(prev => [...prev, created]);
            return created;
        } catch (error) {
            console.error('Failed to create planned event:', error);
            throw error;
        }
    }, []);

    const updatePlannedEvent = useCallback(async (
        id: string,
        updates: Partial<PlannedEvent>
    ) => {
        try {
            const updated = await api.updatePlannedEvent(id, updates);
            setPlannedEvents(prev => prev.map(e => e.id === id ? updated : e));
            return updated;
        } catch (error) {
            console.error('Failed to update planned event:', error);
            throw error;
        }
    }, []);

    const deletePlannedEvent = useCallback(async (id: string) => {
        try {
            await api.deletePlannedEvent(id);
            setPlannedEvents(prev => prev.filter(e => e.id !== id));
        } catch (error) {
            console.error('Failed to delete planned event:', error);
            throw error;
        }
    }, []);

    const createBudgetPlan = useCallback(async (
        plan: Omit<BudgetPlan, 'id' | 'createdAt' | 'updatedAt'>
    ) => {
        try {
            const created = await api.createBudgetPlan(plan);
            setBudgetPlans(prev => [...prev, created]);
            return created;
        } catch (error) {
            console.error('Failed to create budget plan:', error);
            throw error;
        }
    }, []);

    const updateBudgetPlan = useCallback(async (
        id: string,
        updates: Partial<BudgetPlan>
    ) => {
        try {
            const updated = await api.updateBudgetPlan(id, updates);
            setBudgetPlans(prev => prev.map(p => p.id === id ? updated : p));
            return updated;
        } catch (error) {
            console.error('Failed to update budget plan:', error);
            throw error;
        }
    }, []);

    const deleteBudgetPlan = useCallback(async (id: string) => {
        try {
            await api.deleteBudgetPlan(id);
            setBudgetPlans(prev => prev.filter(p => p.id !== id));
        } catch (error) {
            console.error('Failed to delete budget plan:', error);
            throw error;
        }
    }, []);

    const getOfficialPlan = useCallback(() => {
        return budgetPlans.find(p => p.isOfficial) || null;
    }, [budgetPlans]);

    return {
        // Data
        financeEvents,
        plannedEvents,
        budgetPlans,
        syncState,

        createFinanceEvent,
        updateFinanceEvent,
        deleteFinanceEvent,

        createPlannedEvent,
        updatePlannedEvent,
        deletePlannedEvent,

        createBudgetPlan,
        updateBudgetPlan,
        deleteBudgetPlan,
        getOfficialPlan,

        refresh: loadData,
    };
}
