import React, { useState, useEffect } from 'react';
import { RecurringTransaction, Currency } from '../types';
import { PlusIcon, DeleteIcon } from './Icons';

interface RecurringTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (recurring: RecurringTransaction[]) => void;
  initialRecurringTransactions: RecurringTransaction[];
  categories: string[];
  currency: Currency;
  convertFromBase: (amount: number) => number;
}

const RecurringTransactionModal: React.FC<RecurringTransactionModalProps> = ({ isOpen, onClose, onSave, initialRecurringTransactions, categories, currency, convertFromBase }) => {
  // Fix: Corrected the TypeScript syntax for useState with a complex array type. The original syntax `useState<Type>[]` was causing parsing errors in the TSX file. Changed to `useState<(Type)[]>` to resolve ambiguity and fix compilation errors.
  const [rules, setRules] = useState<(Omit<RecurringTransaction, 'amount'> & { amount: string | number })[]>([]);

  useEffect(() => {
    if (isOpen) {
      setRules(initialRecurringTransactions.map(r => ({ ...r, amount: convertFromBase(r.amount).toFixed(2) })));
    }
  }, [isOpen, initialRecurringTransactions, convertFromBase]);

  const handleRuleChange = (id: number, field: keyof RecurringTransaction, value: any) => {
    setRules(prevRules =>
      prevRules.map(rule => {
        if (rule.id === id) {
          const updatedRule = { ...rule, [field]: value };
          if (field === 'startDate') {
            updatedRule.nextDueDate = value;
          }
          if (field === 'type' && value === 'income') {
            updatedRule.category = undefined;
          }
          return updatedRule;
        }
        return rule;
      })
    );
  };

  const handleAddRule = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const newRule: Omit<RecurringTransaction, 'amount'> & { amount: string | number } = {
      id: Date.now(),
      type: 'expense',
      amount: '',
      description: '',
      category: categories.length > 0 ? categories[0] : 'Uncategorized',
      frequency: 'monthly',
      startDate: today.getTime(),
      nextDueDate: today.getTime(),
    };
    setRules(prevRules => [...prevRules, newRule]);
  };

  const handleRemoveRule = (id: number) => {
    setRules(prevRules => prevRules.filter(rule => rule.id !== id));
  };

  const handleSaveChanges = () => {
    const validRules: RecurringTransaction[] = rules
      .filter(r => r.description.trim() !== '' && typeof r.amount === 'string' && parseFloat(r.amount) > 0)
      .map(r => ({ ...r, amount: parseFloat(r.amount as string) }));
    onSave(validRules);
  };

  const timestampToDateString = (timestamp: number) => {
      return new Date(timestamp).toISOString().split('T')[0];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-gray-700 rounded-lg shadow-xl p-6 w-full max-w-4xl m-4 transform transition-all animate-fade-in-up border border-gray-600 flex flex-col" style={{maxHeight: '80vh'}}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-100">Manage Recurring Transactions</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-100 text-2xl leading-none">&times;</button>
        </div>
        
        <div className="flex-1 overflow-y-auto space-y-3 pr-2">
            {rules.map(rule => (
                <div key={rule.id} className="grid grid-cols-1 md:grid-cols-12 gap-2 bg-gray-800 p-3 rounded-lg items-end">
                    {/* Type */}
                    <div className="md:col-span-1">
                        <label className="text-xs text-gray-400">Type</label>
                        <select
                            value={rule.type}
                            onChange={(e) => handleRuleChange(rule.id, 'type', e.target.value)}
                            className="w-full bg-gray-600 border border-gray-500 text-gray-200 rounded-md p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                        >
                            <option value="expense">Expense</option>
                            <option value="income">Income</option>
                        </select>
                    </div>
                    {/* Description */}
                    <div className="md:col-span-3">
                        <label className="text-xs text-gray-400">Description</label>
                        <input
                            type="text"
                            value={rule.description}
                            onChange={(e) => handleRuleChange(rule.id, 'description', e.target.value)}
                            className="w-full bg-gray-600 border border-gray-500 text-gray-200 rounded-md p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                            placeholder="e.g., Netflix Subscription"
                        />
                    </div>
                    {/* Amount */}
                    <div className="md:col-span-2">
                        <label className="text-xs text-gray-400">Amount ({currency})</label>
                        <input
                            type="number"
                            value={rule.amount}
                            onChange={(e) => handleRuleChange(rule.id, 'amount', e.target.value)}
                            className="w-full bg-gray-600 border border-gray-500 text-gray-200 rounded-md p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>
                    {/* Category */}
                    <div className="md:col-span-2">
                        <label className="text-xs text-gray-400">Category</label>
                        <select
                            value={rule.category || ''}
                            onChange={(e) => handleRuleChange(rule.id, 'category', e.target.value)}
                            className="w-full bg-gray-600 border border-gray-500 text-gray-200 rounded-md p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                            disabled={rule.type === 'income'}
                        >
                           {[...categories, 'Uncategorized'].map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    {/* Frequency */}
                    <div className="md:col-span-1">
                        <label className="text-xs text-gray-400">Freq.</label>
                        <select
                            value={rule.frequency}
                            onChange={(e) => handleRuleChange(rule.id, 'frequency', e.target.value)}
                            className="w-full bg-gray-600 border border-gray-500 text-gray-200 rounded-md p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                        >
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                        </select>
                    </div>
                    {/* Start Date */}
                    <div className="md:col-span-2">
                        <label className="text-xs text-gray-400">Start Date</label>
                        <input
                            type="date"
                            value={timestampToDateString(rule.startDate)}
                            onChange={(e) => handleRuleChange(rule.id, 'startDate', new Date(e.target.value).getTime())}
                            className="w-full bg-gray-600 border border-gray-500 text-gray-200 rounded-md p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>
                    {/* Delete */}
                    <div className="md:col-span-1 flex justify-center">
                        <button onClick={() => handleRemoveRule(rule.id)} className="p-2 text-rose-400 hover:text-rose-200 bg-rose-600/50 hover:bg-rose-600 rounded-md h-10 w-10 flex items-center justify-center">
                            <DeleteIcon />
                        </button>
                    </div>
                </div>
            ))}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-600 flex justify-between">
            <button onClick={handleAddRule} className="flex items-center gap-2 bg-gray-600 hover:bg-gray-500 text-gray-200 font-bold py-2 px-4 rounded-lg transition-colors">
                <PlusIcon /> Add Rule
            </button>
            <button onClick={handleSaveChanges} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                Save Changes
            </button>
        </div>
      </div>
       <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.3s ease-out forwards;
        }
        /* Style date picker icon */
        input[type="date"]::-webkit-calendar-picker-indicator {
            filter: invert(0.8);
            cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default RecurringTransactionModal;