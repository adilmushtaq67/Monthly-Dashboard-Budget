
export interface Transaction {
  id: number;
  amount: number;
  description: string;
  timestamp: number;
  category?: string;
}

export interface BudgetGoal {
  id: number;
  category: string;
  target: number;
}

export interface IncomeGoal {
  id: number;
  category: string;
  target: number;
}


// Fix: Added RecurringTransaction interface to define the shape of recurring transaction rules, resolving the import error in RecurringTransactionModal.tsx.
export interface RecurringTransaction {
  id: number;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category?: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  startDate: number;
  nextDueDate: number;
}

export enum ModalType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
  MANAGE_GOALS = 'MANAGE_GOALS',
  NONE = 'NONE'
}

export type Currency = 'PKR' | 'USD' | 'EUR' | 'GBP';
