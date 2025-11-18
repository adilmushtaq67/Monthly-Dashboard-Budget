
import React, { useState, useEffect } from 'react';
import { BudgetGoal, IncomeGoal, Currency } from '../types';
import { PlusIcon, DeleteIcon } from './Icons';

interface BudgetGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (goals: { expenseGoals: BudgetGoal[], incomeGoals: IncomeGoal[] }) => void;
  initialGoals: BudgetGoal[];
  initialIncomeGoals: IncomeGoal[];
  currency: Currency;
  convertFromBase: (amount: number) => number;
}

type ActiveTab = 'expense' | 'income';

const BudgetGoalModal: React.FC<BudgetGoalModalProps> = ({ isOpen, onClose, onSave, initialGoals, initialIncomeGoals, currency, convertFromBase }) => {
  const [expenseGoals, setExpenseGoals] = useState<BudgetGoal[]>([]);
  const [incomeGoals, setIncomeGoals] = useState<IncomeGoal[]>([]);
  const [activeTab, setActiveTab] = useState<ActiveTab>('expense');

  useEffect(() => {
    if (isOpen) {
      setExpenseGoals(initialGoals.map(g => ({...g, target: parseFloat(convertFromBase(g.target).toFixed(2)) })));
      setIncomeGoals(initialIncomeGoals.map(g => ({...g, target: parseFloat(convertFromBase(g.target).toFixed(2)) })));
    }
  }, [isOpen, initialGoals, initialIncomeGoals, convertFromBase]);

  const handleGoalChange = (id: number, field: 'category' | 'target', value: string) => {
    const list = activeTab === 'expense' ? expenseGoals : incomeGoals;
    const setter = activeTab === 'expense' ? setExpenseGoals : setIncomeGoals;
    
    setter(
      list.map(goal =>
        goal.id === id
          ? { ...goal, [field]: field === 'target' ? (parseFloat(value) || 0) : value }
          : goal
      )
    );
  };

  const handleAddGoal = () => {
    const setter = activeTab === 'expense' ? setExpenseGoals : setIncomeGoals;
    setter((prevGoals: any) => [
      ...prevGoals,
      { id: Date.now(), category: '', target: 0 },
    ]);
  };

  const handleRemoveGoal = (id: number) => {
    const setter = activeTab === 'expense' ? setExpenseGoals : setIncomeGoals;
    setter((prevGoals: any) => prevGoals.filter((goal: any) => goal.id !== id));
  };
  
  const handleSaveChanges = () => {
    const validExpenseGoals = expenseGoals.filter(g => g.category.trim() !== '');
    const validIncomeGoals = incomeGoals.filter(g => g.category.trim() !== '');
    onSave({ expenseGoals: validExpenseGoals, incomeGoals: validIncomeGoals });
  };

  if (!isOpen) return null;

  const goals = activeTab === 'expense' ? expenseGoals : incomeGoals;
  
  const inputBaseClass = "w-full bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 text-gray-800 dark:text-gray-200 rounded-md p-2 focus:ring-2 outline-none";
  const focusClass = activeTab === 'expense' 
    ? "focus:ring-purple-500 focus:border-purple-500" 
    : "focus:ring-emerald-500 focus:border-emerald-500";
  const inputClassName = `${inputBaseClass} ${focusClass}`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-700 rounded-lg shadow-xl p-6 w-full max-w-lg m-4 transform transition-all animate-fade-in-up border border-gray-200 dark:border-gray-600 flex flex-col" style={{maxHeight: '80vh'}}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Manage Goals</h2>
          <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-100 text-2xl leading-none">&times;</button>
        </div>

        <div className="flex border-b border-gray-200 dark:border-gray-600 mb-4">
            <button 
                onClick={() => setActiveTab('expense')}
                className={`py-2 px-4 font-medium transition-colors ${activeTab === 'expense' ? 'border-b-2 border-purple-500 text-purple-600 dark:text-purple-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'}`}>
                Expense Goals
            </button>
            <button
                onClick={() => setActiveTab('income')}
                className={`py-2 px-4 font-medium transition-colors ${activeTab === 'income' ? 'border-b-2 border-emerald-500 text-emerald-600 dark:text-emerald-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'}`}>
                Income Goals
            </button>
        </div>
        
        <div className="flex-1 overflow-y-auto space-y-3 pr-2">
            {goals.map(goal => (
                <div key={goal.id} className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 p-2 rounded-lg">
                    <div className="flex-1">
                        <label className="text-xs text-gray-500 dark:text-gray-400">Category</label>
                        <input
                            type="text"
                            value={goal.category}
                            onChange={(e) => handleGoalChange(goal.id, 'category', e.target.value)}
                            className={inputClassName}
                            placeholder={`e.g., ${activeTab === 'expense' ? 'Groceries' : 'Salary'}`}
                        />
                    </div>
                    <div className="w-40">
                         <label className="text-xs text-gray-500 dark:text-gray-400">Target ({currency})</label>
                        <input
                            type="number"
                            value={goal.target}
                            onChange={(e) => handleGoalChange(goal.id, 'target', e.target.value)}
                            className={inputClassName}
                            placeholder="e.g., 100"
                            step="0.01"
                        />
                    </div>
                    <button onClick={() => handleRemoveGoal(goal.id)} className="self-end p-2 text-rose-600 dark:text-rose-400 hover:text-rose-800 dark:hover:text-rose-200 bg-rose-100 dark:bg-rose-600/50 hover:bg-rose-200 dark:hover:bg-rose-600 rounded-md h-10 w-10 flex items-center justify-center">
                        <DeleteIcon />
                    </button>
                </div>
            ))}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600 flex justify-between">
            <button onClick={handleAddGoal} className="flex items-center gap-2 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-200 font-bold py-2 px-4 rounded-lg transition-colors">
                <PlusIcon /> Add Goal
            </button>
            <button onClick={handleSaveChanges} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
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
      `}</style>
    </div>
  );
};

export default BudgetGoalModal;
