import React from 'react';
import { TargetIcon } from './Icons';

interface GoalWithProgress {
  id: number;
  category: string;
  target: number;
  currentSpending: number;
}

interface BudgetGoalsProps {
  goals: GoalWithProgress[];
  onManageClick: () => void;
  formatCurrency: (amount: number) => string;
}

const getProgressBarColor = (percentage: number) => {
  if (percentage > 90) return 'bg-rose-500';
  if (percentage > 70) return 'bg-amber-500';
  return 'bg-emerald-500';
};

const getBudgetGoalStatus = (percentage: number) => {
    if (percentage > 90) {
        return { text: 'Exceeded', className: 'bg-rose-100 text-rose-600 dark:bg-rose-900/50 dark:text-rose-400' };
    }
    if (percentage > 70) {
        return { text: 'At Risk', className: 'bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400' };
    }
    return { text: 'On Track', className: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400' };
};


const BudgetGoals: React.FC<BudgetGoalsProps> = ({ goals, onManageClick, formatCurrency }) => {
  return (
    <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-600">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Monthly Budget Goals</h3>
        <button 
          onClick={onManageClick}
          className="flex items-center gap-2 text-sm text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-600/50 hover:bg-purple-200 dark:hover:bg-purple-600/80 font-medium py-2 px-3 rounded-lg transition-colors"
        >
          <TargetIcon />
          Manage
        </button>
      </div>
      <div className="space-y-4">
        {goals.length > 0 ? goals.map(goal => {
          const percentage = goal.target > 0 ? (goal.currentSpending / goal.target) * 100 : 0;
          const progressBarColor = getProgressBarColor(percentage);
          const status = getBudgetGoalStatus(percentage);

          return (
            <div key={goal.id}>
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">{goal.category}</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${status.className}`}>
                        {status.text}
                    </span>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                  {formatCurrency(goal.currentSpending)} / {formatCurrency(goal.target)}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2.5">
                <div 
                  className={`${progressBarColor} h-2.5 rounded-full transition-all duration-500`}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                ></div>
              </div>
            </div>
          );
        }) : (
            <div className="text-center text-gray-500 dark:text-gray-400 py-4">
                No budget goals set. Click 'Manage' to add one.
            </div>
        )}
      </div>
    </div>
  );
};

export default BudgetGoals;