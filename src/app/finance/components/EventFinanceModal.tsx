import {useEffect, useState} from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import type {EventItem} from '@/app/calendar/types';
import type {BudgetCategory, FinanceEvent, PurchaseItem} from '../types/finance';
import {detectEventCategory, formatCurrency, validateBudgetAllocation} from '../lib/financeUtils';
import {FaExclamationTriangle, FaPlus, FaTimes, FaTrash} from 'react-icons/fa';
import {AcademicYear} from "@/app/calendar/types";

interface EventFinanceModalProps {
    event: EventItem | null;
    existingFinance?: FinanceEvent;
    academicYear: AcademicYear;
    allFinanceEvents: FinanceEvent[];
    allPlannedEvents: any[];
    isOpen: boolean;
    onClose: () => void;
    onSave: (finance: Omit<FinanceEvent, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
}

export function EventFinanceModal({
                                      event,
                                      existingFinance,
                                      academicYear,
                                      allFinanceEvents,
                                      allPlannedEvents,
                                      isOpen,
                                      onClose,
                                      onSave,
                                  }: EventFinanceModalProps) {
    const [purchases, setPurchases] = useState<PurchaseItem[]>([]);
    const [category, setCategory] = useState<BudgetCategory>('Social/Service');
    const [sgaAmount, setSgaAmount] = useState<string>('');
    const [groupFundsAmount, setGroupFundsAmount] = useState<string>('');
    const [attendees, setAttendees] = useState<string>('');
    const [notes, setNotes] = useState('');
    const [isPaid, setIsPaid] = useState(true);
    const [budgetWarning, setBudgetWarning] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (existingFinance) {
            setPurchases(existingFinance.purchases || []);
            setCategory(existingFinance.category);
            setSgaAmount(existingFinance.sgaAmount.toString());
            setGroupFundsAmount(existingFinance.groupFundsAmount.toString());
            setAttendees(existingFinance.attendeeCount?.toString() || '');
            setNotes(existingFinance.notes || '');
            setIsPaid(existingFinance.isPaid);
        } else if (event) {
            const detected = detectEventCategory(event.title);
            setCategory(detected);
            setPurchases([]);
            setSgaAmount('');
            setGroupFundsAmount('');
            setAttendees('');
            setNotes('');
            setIsPaid(true);
        }
        setBudgetWarning(null);
    }, [existingFinance, event, isOpen]);

    const addPurchase = () => {
        setPurchases([
            ...purchases,
            {
                id: `purchase-${Date.now()}`,
                name: '',
                quantity: 1,
                unitCost: 0,
                totalCost: 0,
                vendor: '',
            },
        ]);
    };

    const updatePurchase = (id: string, field: keyof PurchaseItem, value: any) => {
        setPurchases(prev =>
            prev.map(p => {
                if (p.id !== id) return p;

                const updated = {...p, [field]: value};

                if (field === 'quantity' || field === 'unitCost') {
                    updated.totalCost = updated.quantity * updated.unitCost;
                }

                return updated;
            })
        );
    };

    const deletePurchase = (id: string) => {
        setPurchases(prev => prev.filter(p => p.id !== id));
    };

    const totalCost = purchases.reduce((sum, p) => sum + p.totalCost, 0);

    useEffect(() => {
        if (!sgaAmount || parseFloat(sgaAmount) === 0) {
            setBudgetWarning(null);
            return;
        }

        const validation = validateBudgetAllocation(
            category,
            parseFloat(sgaAmount) || 0,
            parseFloat(groupFundsAmount) || 0,
            academicYear,
            allFinanceEvents,
            allPlannedEvents,
            existingFinance?.id
        );

        if (!validation.isValid) {
            setBudgetWarning(validation.warning || null);
        } else {
            setBudgetWarning(null);
        }
    }, [category, sgaAmount, groupFundsAmount, academicYear, allFinanceEvents, allPlannedEvents, existingFinance]);

    const handleAutoSplit = () => {
        const sga = parseFloat(sgaAmount) || 0;
        const groupFunds = parseFloat(groupFundsAmount) || 0;
        const currentTotal = sga + groupFunds;

        if (currentTotal < totalCost) {
            setGroupFundsAmount((totalCost - sga).toFixed(2));
        }
    };

    const handleSave = async () => {
        if (!event || purchases.length === 0) return;

        setIsSaving(true);

        try {
            const sga = parseFloat(sgaAmount) || 0;
            const gf = parseFloat(groupFundsAmount) || 0;

            const financeData: Omit<FinanceEvent, 'id' | 'createdAt' | 'updatedAt'> = {
                eventId: event.id,
                purchases,
                totalCost,
                category,
                sgaAmount: sga,
                groupFundsAmount: gf,
                attendeeCount: attendees ? parseInt(attendees) : undefined,
                costPerPerson: attendees ? totalCost / parseInt(attendees) : undefined,
                notes: notes || undefined,
                isPaid,
            };

            await onSave(financeData);
            onClose();
        } catch (error) {
            console.error('Failed to save:', error);
            alert('Failed to save financial data. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    if (!event) return null;

    const sgaPlusGroupFunds = (parseFloat(sgaAmount) || 0) + (parseFloat(groupFundsAmount) || 0);
    const allocationMismatch = Math.abs(sgaPlusGroupFunds - totalCost) > 0.01;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 z-50"
                    />

                    <motion.div
                        initial={{opacity: 0, scale: 0.95, y: 20}}
                        animate={{opacity: 1, scale: 1, y: 0}}
                        exit={{opacity: 0, scale: 0.95, y: 20}}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
                    >
                        <div
                            className="card card-body max-w-4xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto">
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold">{event.title}</h2>
                                    <p className="text-sm card-subtle mt-1">
                                        {new Date(event.startsAt).toLocaleDateString()} • {event.location}
                                    </p>
                                </div>
                                <button onClick={onClose} className="btn-icon">
                                    <FaTimes/>
                                </button>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium mb-2">Budget Category *</label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value as BudgetCategory)}
                                    className="w-full px-4 py-2 border rounded-lg dark:bg-neutral-800 dark:border-neutral-700"
                                >
                                    <option value="Travel">Travel</option>
                                    <option value="Cultural Events">Cultural Events</option>
                                    <option value="Social/Service">Social/Service</option>
                                </select>
                            </div>

                            <div className="space-y-4 mb-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-bold text-lg">Purchase Items *</h3>
                                    <button onClick={addPurchase}
                                            className="btn btn-primary text-sm flex items-center gap-2">
                                        <FaPlus/> Add Item
                                    </button>
                                </div>

                                {purchases.length === 0 ? (
                                    <div
                                        className="text-center py-8 text-neutral-500 dark:text-neutral-400 border-2 border-dashed rounded-lg">
                                        No purchases added yet. Click "Add Item" to start.
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {purchases.map((purchase) => (
                                            <div key={purchase.id}
                                                 className="grid grid-cols-12 gap-3 p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                                                <input
                                                    type="text"
                                                    placeholder="Item name"
                                                    value={purchase.name}
                                                    onChange={(e) => updatePurchase(purchase.id, 'name', e.target.value)}
                                                    className="col-span-4 px-3 py-2 border rounded dark:bg-neutral-700 dark:border-neutral-600 text-sm"
                                                />
                                                <input
                                                    type="number"
                                                    placeholder="Qty"
                                                    value={purchase.quantity}
                                                    onChange={(e) => updatePurchase(purchase.id, 'quantity', parseInt(e.target.value) || 0)}
                                                    className="col-span-2 px-3 py-2 border rounded dark:bg-neutral-700 dark:border-neutral-600 text-sm"
                                                    min="1"
                                                />
                                                <input
                                                    type="number"
                                                    placeholder="Unit $"
                                                    value={purchase.unitCost}
                                                    onChange={(e) => updatePurchase(purchase.id, 'unitCost', parseFloat(e.target.value) || 0)}
                                                    className="col-span-2 px-3 py-2 border rounded dark:bg-neutral-700 dark:border-neutral-600 text-sm"
                                                    min="0"
                                                    step="0.01"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Vendor"
                                                    value={purchase.vendor || ''}
                                                    onChange={(e) => updatePurchase(purchase.id, 'vendor', e.target.value)}
                                                    className="col-span-2 px-3 py-2 border rounded dark:bg-neutral-700 dark:border-neutral-600 text-sm"
                                                />
                                                <div className="col-span-1 flex items-center">
                                                    <span
                                                        className="text-sm font-bold">{formatCurrency(purchase.totalCost)}</span>
                                                </div>
                                                <div className="col-span-1 flex items-center justify-center">
                                                    <button onClick={() => deletePurchase(purchase.id)}
                                                            className="text-red-600 hover:text-red-700">
                                                        <FaTrash/>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {purchases.length > 0 && (
                                    <div
                                        className="flex justify-end items-center gap-4 pt-3 border-t border-neutral-200 dark:border-neutral-700">
                                        <span className="font-medium">Total Cost:</span>
                                        <span className="text-2xl font-bold text-rhit-maroon dark:text-red-400">
                      {formatCurrency(totalCost)}
                    </span>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4 mb-6">
                                <h3 className="font-bold text-lg">Budget Allocation *</h3>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">SGA Amount</label>
                                        <input
                                            type="number"
                                            placeholder="0.00"
                                            value={sgaAmount}
                                            onChange={(e) => setSgaAmount(e.target.value)}
                                            className="w-full px-4 py-2 border rounded-lg dark:bg-neutral-800 dark:border-neutral-700"
                                            step="0.01"
                                            min="0"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Group Funds Amount</label>
                                        <input
                                            type="number"
                                            placeholder="0.00"
                                            value={groupFundsAmount}
                                            onChange={(e) => setGroupFundsAmount(e.target.value)}
                                            className="w-full px-4 py-2 border rounded-lg dark:bg-neutral-800 dark:border-neutral-700"
                                            step="0.01"
                                            min="0"
                                        />
                                    </div>
                                </div>

                                {allocationMismatch && (
                                    <div
                                        className="p-3 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg border border-yellow-200 dark:border-yellow-800">
                                        <p className="text-sm text-yellow-700 dark:text-yellow-400">
                                            WARNING:️ Allocation ({formatCurrency(sgaPlusGroupFunds)}) doesn't match total cost
                                            ({formatCurrency(totalCost)})
                                            <button onClick={handleAutoSplit} className="ml-2 underline font-medium">
                                                Auto-adjust
                                            </button>
                                        </p>
                                    </div>
                                )}

                                {budgetWarning && (
                                    <div
                                        className="p-4 bg-red-50 dark:bg-red-900/10 rounded-lg border-2 border-red-500">
                                        <div className="flex items-start gap-3">
                                            <FaExclamationTriangle className="text-red-600 dark:text-red-400 mt-0.5"/>
                                            <div>
                                                <p className="text-sm font-medium text-red-700 dark:text-red-400 mb-1">
                                                    Category Budget Exceeded
                                                </p>
                                                <p className="text-sm text-red-600 dark:text-red-400">
                                                    {budgetWarning}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Attendee Count</label>
                                    <input
                                        type="number"
                                        placeholder="Optional"
                                        value={attendees}
                                        onChange={(e) => setAttendees(e.target.value)}
                                        className="w-full px-4 py-2 border rounded-lg dark:bg-neutral-800 dark:border-neutral-700"
                                        min="1"
                                    />
                                    {attendees && totalCost > 0 && (
                                        <p className="text-sm card-subtle mt-1">
                                            Cost per person: {formatCurrency(totalCost / parseInt(attendees))}
                                        </p>
                                    )}
                                </div>

                                <div className="flex items-end">
                                    <label
                                        className="flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800 dark:border-neutral-700 h-[42px]">
                                        <input
                                            type="checkbox"
                                            checked={isPaid}
                                            onChange={(e) => setIsPaid(e.target.checked)}
                                            className="rounded"
                                        />
                                        <span className="text-sm font-medium">Marked as Paid</span>
                                    </label>
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium mb-2">Notes</label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Additional notes..."
                                    rows={3}
                                    className="w-full px-4 py-2 border rounded-lg dark:bg-neutral-800 dark:border-neutral-700"
                                />
                            </div>

                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={onClose}
                                    className="btn bg-neutral-200 text-neutral-700 hover:bg-neutral-300 dark:bg-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-600"
                                    disabled={isSaving}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="btn btn-accent"
                                    disabled={purchases.length === 0 || isSaving || allocationMismatch}
                                >
                                    {isSaving ? 'Saving...' : 'Save Financial Data'}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
