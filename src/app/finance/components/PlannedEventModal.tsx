'use client';

import React, {useEffect, useState} from 'react';
import {FaTimes} from 'react-icons/fa';
import type {BudgetCategory, PlannedEvent} from '../types/finance';
import type {AcademicYear, Quarter} from '@/app/calendar/types';

interface PlannedEventModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Omit<PlannedEvent, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
    existingEvent?: PlannedEvent;
    academicYear: AcademicYear;
}

const CATEGORIES: BudgetCategory[] = ['Travel', 'Cultural Events', 'Social/Service'];
const QUARTERS: Quarter[] = ['fall', 'winter', 'spring'];

export function PlannedEventModal({
                                      isOpen,
                                      onClose,
                                      onSave,
                                      existingEvent,
                                      academicYear,
                                  }: PlannedEventModalProps) {
    const [formData, setFormData] = useState({
        title: '',
        date: '',
        quarter: 'fall' as Quarter,
        estimatedCost: 0,
        category: 'Social/Service' as BudgetCategory,
        sgaAmount: 0,
        groupFundsAmount: 0,
        expectedAttendees: undefined as number | undefined,
        notes: '',
    });

    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (existingEvent) {
            setFormData({
                title: existingEvent.title,
                date: existingEvent.date,
                quarter: existingEvent.quarter,
                estimatedCost: existingEvent.estimatedCost,
                category: existingEvent.category,
                sgaAmount: existingEvent.sgaAmount,
                groupFundsAmount: existingEvent.groupFundsAmount,
                expectedAttendees: existingEvent.expectedAttendees,
                notes: existingEvent.notes || '',
            });
        } else {
            // Reset for new event
            setFormData({
                title: '',
                date: '',
                quarter: 'fall',
                estimatedCost: 0,
                category: 'Social/Service',
                sgaAmount: 0,
                groupFundsAmount: 0,
                expectedAttendees: undefined,
                notes: '',
            });
        }
    }, [existingEvent, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            await onSave({
                ...formData,
                academicYear,
            });
            onClose();
        } catch (error) {
            console.error('Error saving planned event:', error);
            alert('Failed to save event. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-neutral-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b dark:border-neutral-800">
                    <h2 className="text-2xl font-bold">
                        {existingEvent ? 'Edit Planned Event' : 'Add Planned Event'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                    >
                        <FaTimes className="w-5 h-5"/>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">Event Title *</label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                            className="w-full px-4 py-2 border rounded-lg dark:bg-neutral-800 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-rhit-maroon"
                            placeholder="Holiday Party"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Date *</label>
                            <input
                                type="date"
                                required
                                value={formData.date}
                                onChange={(e) => setFormData({...formData, date: e.target.value})}
                                className="w-full px-4 py-2 border rounded-lg dark:bg-neutral-800 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-rhit-maroon"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Quarter *</label>
                            <select
                                required
                                value={formData.quarter}
                                onChange={(e) => setFormData({...formData, quarter: e.target.value as Quarter})}
                                className="w-full px-4 py-2 border rounded-lg dark:bg-neutral-800 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-rhit-maroon"
                            >
                                {QUARTERS.map(q => (
                                    <option key={q} value={q}>{q.charAt(0).toUpperCase() + q.slice(1)}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Category *</label>
                        <select
                            required
                            value={formData.category}
                            onChange={(e) => setFormData({...formData, category: e.target.value as BudgetCategory})}
                            className="w-full px-4 py-2 border rounded-lg dark:bg-neutral-800 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-rhit-maroon"
                        >
                            {CATEGORIES.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Estimated Cost *</label>
                            <input
                                type="number"
                                required
                                min="0"
                                step="0.01"
                                value={formData.estimatedCost}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    estimatedCost: parseFloat(e.target.value) || 0
                                })}
                                className="w-full px-4 py-2 border rounded-lg dark:bg-neutral-800 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-rhit-maroon"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">SGA Amount</label>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={formData.sgaAmount}
                                onChange={(e) => setFormData({...formData, sgaAmount: parseFloat(e.target.value) || 0})}
                                className="w-full px-4 py-2 border rounded-lg dark:bg-neutral-800 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-rhit-maroon"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Group Funds</label>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={formData.groupFundsAmount}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    groupFundsAmount: parseFloat(e.target.value) || 0
                                })}
                                className="w-full px-4 py-2 border rounded-lg dark:bg-neutral-800 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-rhit-maroon"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Expected Attendees</label>
                        <input
                            type="number"
                            min="0"
                            value={formData.expectedAttendees || ''}
                            onChange={(e) => setFormData({
                                ...formData,
                                expectedAttendees: e.target.value ? parseInt(e.target.value) : undefined
                            })}
                            className="w-full px-4 py-2 border rounded-lg dark:bg-neutral-800 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-rhit-maroon"
                            placeholder="50"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Notes</label>
                        <textarea
                            value={formData.notes}
                            onChange={(e) => setFormData({...formData, notes: e.target.value})}
                            className="w-full px-4 py-2 border rounded-lg dark:bg-neutral-800 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-rhit-maroon"
                            rows={3}
                            placeholder="Additional planning notes..."
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t dark:border-neutral-800">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSaving}
                            className="px-6 py-2 border rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="px-6 py-2 bg-rhit-maroon text-white rounded-lg hover:bg-rhit-maroon-dark transition-colors disabled:opacity-50"
                        >
                            {isSaving ? 'Saving...' : existingEvent ? 'Update Event' : 'Create Event'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}