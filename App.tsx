import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Transaction, ModalType, BudgetGoal, IncomeGoal, Currency } from './types';
import SummaryCard from './components/SummaryCard';
import ExpensesPieChart from './components/ExpensesPieChart';
import TransactionModal from './components/TransactionModal';
import TransactionList from './components/TransactionList';
import HistorySummary from './components/HistorySummary';
import BudgetGoals from './components/BudgetGoals';
import IncomeGoals from './components/IncomeGoals';
import BudgetGoalModal from './components/BudgetGoalModal';
import { PlusIcon, ArrowUpIcon, ArrowDownIcon, WalletIcon, DownloadIcon, SaveIcon, TargetIcon, SunIcon, MoonIcon, TrashIcon } from './components/Icons';

interface MonthlySummary {
  month: string;
  year: number;
  totalIncome: number;
  totalExpenses: number;
  savings: number;
}

const initialIncome: Transaction[] = [
    { id: 1, amount: 50000, description: 'Monthly Salary', category: 'Salary', timestamp: Date.now() - 10 * 24 * 60 * 60 * 1000 },
    { id: 2, amount: 5000, description: 'Freelance Project', category: 'Freelance', timestamp: Date.now() - 5 * 24 * 60 * 60 * 1000 },
];
const initialExpenses: Transaction[] = [
    { id: 1, amount: 15000, description: 'Rent', category: 'Housing', timestamp: Date.now() - 20 * 24 * 60 * 60 * 1000 },
    { id: 2, amount: 4500, description: 'Groceries', category: 'Food', timestamp: Date.now() - 18 * 24 * 60 * 60 * 1000 },
    { id: 3, amount: 2000, description: 'Utilities', category: 'Bills', timestamp: Date.now() - 15 * 24 * 60 * 60 * 1000 },
    { id: 4, amount: 1200, description: 'Internet', category: 'Bills', timestamp: Date.now() - 12 * 24 * 60 * 60 * 1000 },
    { id: 5, amount: 1500, description: 'Transport', category: 'Transport', timestamp: Date.now() - 8 * 24 * 60 * 60 * 1000 },
    { id: 6, amount: 3000, description: 'Entertainment', category: 'Entertainment', timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000 },
];

const initialGoals: BudgetGoal[] = [
    { id: 1, category: 'Food', target: 10000 },
    { id: 2, category: 'Housing', target: 15000 },
    { id: 3, category: 'Transport', target: 3000 },
    { id: 4, category: 'Entertainment', target: 5000 },
    { id: 5, category: 'Bills', target: 4000 },
];

const initialIncomeGoals: IncomeGoal[] = [
    { id: 1, category: 'Salary', target: 50000 },
    { id: 2, category: 'Freelance', target: 7500 },
];

const CONVERSION_RATES: Record<Currency, number> = {
  PKR: 1,
  USD: 1 / 278,
  EUR: 1 / 300,
  GBP: 1 / 350,
};

const App: React.FC = () => {
  const [income, setIncome] = useState<Transaction[]>(() => {
    try {
        const savedIncome = localStorage.getItem('budget-income');
        return savedIncome ? JSON.parse(savedIncome) : initialIncome;
    } catch (error) {
        console.error("Failed to parse income from localStorage", error);
        return initialIncome;
    }
  });
  const [expenses, setExpenses] = useState<Transaction[]>(() => {
    try {
        const savedExpenses = localStorage.getItem('budget-expenses');
        return savedExpenses ? JSON.parse(savedExpenses) : initialExpenses;
    } catch (error) {
        console.error("Failed to parse expenses from localStorage", error);
        return initialExpenses;
    }
  });
  const [budgetGoals, setBudgetGoals] = useState<BudgetGoal[]>(() => {
    try {
        const savedGoals = localStorage.getItem('budget-goals');
        return savedGoals ? JSON.parse(savedGoals) : initialGoals;
    } catch (error) {
        console.error("Failed to parse goals from localStorage", error);
        return initialGoals;
    }
  });

  const [incomeGoals, setIncomeGoals] = useState<IncomeGoal[]>(() => {
    try {
        const savedGoals = localStorage.getItem('budget-income-goals');
        return savedGoals ? JSON.parse(savedGoals) : initialIncomeGoals;
    } catch (error) {
        console.error("Failed to parse income goals from localStorage", error);
        return initialIncomeGoals;
    }
  });

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
    return 'dark';
  });

  const [currency, setCurrency] = useState<Currency>(() => {
    const savedCurrency = localStorage.getItem('budget-currency');
    return (savedCurrency as Currency) || 'PKR';
  });

  useEffect(() => {
    localStorage.setItem('budget-currency', currency);
  }, [currency]);


  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };


  const [history] = useState<MonthlySummary[]>([
      { month: 'June', year: 2024, totalIncome: 52000, totalExpenses: 25000, savings: 27000 },
      { month: 'May', year: 2024, totalIncome: 55000, totalExpenses: 30000, savings: 25000 },
      { month: 'April', year: 2024, totalIncome: 48000, totalExpenses: 22000, savings: 26000 },
  ]);
  const [modal, setModal] = useState<ModalType>(ModalType.NONE);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [appliedStartDate, setAppliedStartDate] = useState('');
  const [appliedEndDate, setAppliedEndDate] = useState('');
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [saveStatus, setSaveStatus] = useState<string>('');
  
  const convertFromBase = useCallback((amount: number) => {
    return amount * CONVERSION_RATES[currency];
  }, [currency]);

  const convertToBase = useCallback((amount: number) => {
    return amount / CONVERSION_RATES[currency];
  }, [currency]);

  const formatCurrency = useCallback((amount: number) => {
    const convertedAmount = convertFromBase(amount);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
    }).format(convertedAmount);
  }, [convertFromBase, currency]);
  
  const totalIncome = useMemo(() => income.reduce((sum, item) => sum + item.amount, 0), [income]);
  const totalExpenses = useMemo(() => expenses.reduce((sum, item) => sum + item.amount, 0), [expenses]);
  const savings = useMemo(() => totalIncome - totalExpenses, [totalIncome, totalExpenses]);
  
  const goalsWithProgress = useMemo(() => {
    return budgetGoals.map(goal => {
        const currentSpending = expenses
            .filter(expense => expense.category === goal.category)
            .reduce((sum, expense) => sum + expense.amount, 0);
        return { ...goal, currentSpending };
    });
  }, [budgetGoals, expenses]);

  const incomeGoalsWithProgress = useMemo(() => {
    return incomeGoals.map(goal => {
        const currentIncome = income
            .filter(inc => inc.category === goal.category)
            .reduce((sum, inc) => sum + inc.amount, 0);
        return { ...goal, currentIncome };
    });
  }, [incomeGoals, income]);

  const handleOpenEditModal = useCallback((transaction: Transaction, type: ModalType.INCOME | ModalType.EXPENSE) => {
    setEditingTransaction(transaction);
    setModal(type);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModal(ModalType.NONE);
    setEditingTransaction(null);
  }, []);

  const handleSubmitTransaction = useCallback((type: ModalType.INCOME | ModalType.EXPENSE, amount: number, description: string, category?: string) => {
    const baseAmount = convertToBase(amount);
    if (editingTransaction) {
      // Update existing transaction
      const updatedTransaction = { ...editingTransaction, amount: baseAmount, description, category };
      if (type === ModalType.INCOME) {
        setIncome(prev => prev.map(t => t.id === editingTransaction.id ? updatedTransaction : t));
      } else {
        setExpenses(prev => prev.map(t => t.id === editingTransaction.id ? updatedTransaction : t));
      }
    } else {
      // Add new transaction
      const newTransaction: Transaction = {
        id: Date.now(),
        amount: baseAmount,
        description,
        timestamp: Date.now(),
        category,
      };
      if (type === ModalType.INCOME) {
        setIncome(prev => [...prev, newTransaction]);
      } else {
        setExpenses(prev => [...prev, newTransaction]);
      }
    }
    handleCloseModal();
  }, [editingTransaction, handleCloseModal, convertToBase]);
  
  const handleSaveData = useCallback(() => {
    try {
        localStorage.setItem('budget-income', JSON.stringify(income));
        localStorage.setItem('budget-expenses', JSON.stringify(expenses));
        localStorage.setItem('budget-goals', JSON.stringify(budgetGoals));
        localStorage.setItem('budget-income-goals', JSON.stringify(incomeGoals));
        setSaveStatus('Data saved successfully!');
        setTimeout(() => setSaveStatus(''), 3000);
    } catch (error) {
        console.error("Failed to save data to localStorage", error);
        setSaveStatus('Error saving data.');
        setTimeout(() => setSaveStatus(''), 3000);
    }
  }, [income, expenses, budgetGoals, incomeGoals]);

  const handleSaveAllGoals = useCallback(({ expenseGoals, incomeGoals }: { expenseGoals: BudgetGoal[], incomeGoals: IncomeGoal[] }) => {
    const convertedExpenseGoals = expenseGoals.map(g => ({ ...g, target: convertToBase(g.target) }));
    const convertedIncomeGoals = incomeGoals.map(g => ({ ...g, target: convertToBase(g.target) }));
    setBudgetGoals(convertedExpenseGoals);
    setIncomeGoals(convertedIncomeGoals);
    handleCloseModal();
  }, [handleCloseModal, convertToBase]);
  
  const handleDeleteTransaction = useCallback((id: number, type: 'income' | 'expense') => {
    if (window.confirm(`Are you sure you want to delete this ${type} record? This action cannot be undone.`)) {
      if (type === 'income') {
        setIncome(prev => prev.filter(t => t.id !== id));
      } else {
        setExpenses(prev => prev.filter(t => t.id !== id));
      }
    }
  }, []);

  const handleClearAllData = useCallback(() => {
    if (window.confirm('Are you sure you want to clear all data? This will reset all income, expenses, and goals to their default values. This action cannot be undone.')) {
        try {
            localStorage.removeItem('budget-income');
            localStorage.removeItem('budget-expenses');
            localStorage.removeItem('budget-goals');
            localStorage.removeItem('budget-income-goals');

            setIncome(initialIncome);
            setExpenses(initialExpenses);
            setBudgetGoals(initialGoals);
            setIncomeGoals(initialIncomeGoals);

            setSaveStatus('All data cleared successfully!');
            setTimeout(() => setSaveStatus(''), 3000);
        } catch (error) {
            console.error("Failed to clear data from localStorage", error);
            setSaveStatus('Error clearing data.');
            setTimeout(() => setSaveStatus(''), 3000);
        }
    }
  }, []);

  const handleApplyFilter = useCallback(() => {
    setAppliedStartDate(startDate);
    setAppliedEndDate(endDate);
  }, [startDate, endDate]);

  const handleClearFilter = useCallback(() => {
    setStartDate('');
    setEndDate('');
    setAppliedStartDate('');
    setAppliedEndDate('');
  }, []);

  const filterAndSortTransactions = (transactions: Transaction[]) => {
    return transactions
      .filter(t => {
        if (!appliedStartDate && !appliedEndDate) return true;
        const start = appliedStartDate ? new Date(appliedStartDate).getTime() : -Infinity;
        // Add 1 day in milliseconds to the end date to include the entire day
        const end = appliedEndDate ? new Date(appliedEndDate).getTime() + (24 * 60 * 60 * 1000) : Infinity;
        return t.timestamp >= start && t.timestamp < end;
      })
      .sort((a, b) => b.timestamp - a.timestamp);
  };

  const filteredIncome = useMemo(() => filterAndSortTransactions(income), [income, appliedStartDate, appliedEndDate]);
  const filteredExpenses = useMemo(() => filterAndSortTransactions(expenses), [expenses, appliedStartDate, appliedEndDate]);

  const currentMonth = new Date().toLocaleString('default', { month: 'long' });

  const exportToCSV = (transactions: Transaction[], filename: string) => {
    if (transactions.length === 0) {
        alert(`No transactions to export in the selected date range.`);
        return;
    }
    const headers = ['Type', 'Date', 'Time', 'Description', 'Category', `Amount (${currency})`];
    const rows = transactions.map(t => {
        const date = new Date(t.timestamp);
        const type = income.some(inc => inc.id === t.id) ? 'Income' : 'Expense';
        const formattedDate = date.toLocaleDateString('en-CA');
        const formattedTime = date.toLocaleTimeString('en-US', { hour12: false });
        const description = `"${t.description.replace(/"/g, '""')}"`;
        const category = t.category || '';
        const amount = convertFromBase(t.amount).toFixed(2);
        return [type, formattedDate, formattedTime, description, category, amount].join(',');
    });
    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportIncomeCSV = useCallback(() => {
    exportToCSV(filteredIncome, 'income_transactions.csv');
  }, [filteredIncome, currency, convertFromBase]);

  const handleExportExpenseCSV = useCallback(() => {
    exportToCSV(filteredExpenses, 'expense_transactions.csv');
  }, [filteredExpenses, currency, convertFromBase]);


  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100">Monthly Budget Summary</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Your financial overview for the month.</p>
          </div>
          <div className="flex items-center gap-4">
            <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as Currency)}
                className="bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 rounded-md p-2 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
                aria-label="Select currency"
            >
                <option value="PKR">PKR</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
            </select>
            <button 
              onClick={toggleTheme} 
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <MoonIcon /> : <SunIcon />}
            </button>
          </div>
        </header>

        <main>
          {/* Month Header */}
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">{currentMonth} Overview</h2>
          
          {/* Date Range Filter */}
          <div className="bg-white dark:bg-gray-700 p-4 rounded-xl shadow-md border border-gray-200 dark:border-gray-600 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex-shrink-0">Filter Transactions</h3>
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 w-full sm:w-auto">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Start Date</label>
                <input
                  type="date"
                  id="startDate"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 rounded-md p-2 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
                />
              </div>
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">End Date</label>
                <input
                  type="date"
                  id="endDate"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 rounded-md p-2 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
                />
              </div>
              <button
                onClick={handleApplyFilter}
                className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded-lg transition-colors h-fit"
              >
                Execute
              </button>
              <button
                onClick={handleClearFilter}
                className="bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-200 font-bold py-2 px-4 rounded-lg transition-colors h-fit"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <SummaryCard title="Total Income" amount={formatCurrency(totalIncome)} icon={<ArrowUpIcon />} color="text-emerald-500 dark:text-emerald-400" bgColor="bg-emerald-100 dark:bg-emerald-900/50" />
            <SummaryCard title="Total Expenses" amount={formatCurrency(totalExpenses)} icon={<ArrowDownIcon />} color="text-rose-500 dark:text-rose-400" bgColor="bg-rose-100 dark:bg-rose-900/50" />
            <SummaryCard title="Savings" amount={formatCurrency(savings)} icon={<WalletIcon />} color={savings >= 0 ? 'text-sky-500 dark:text-sky-400' : 'text-amber-500 dark:text-amber-400'} bgColor={savings >= 0 ? 'bg-sky-100 dark:bg-sky-900/50' : 'bg-amber-100 dark:bg-amber-900/50'} />
          </div>

          {/* Chart and Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Column */}
            <div className="lg:col-span-2 flex flex-col gap-8">
                <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-600">
                    <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Income Allocation</h2>
                    {(totalExpenses > 0 || savings > 0) ? (
                        <ExpensesPieChart expenses={totalExpenses} savings={savings} formatCurrency={formatCurrency} />
                    ) : (
                        <div className="flex items-center justify-center h-80 text-gray-500 dark:text-gray-400">
                            Add income and expenses to see the chart.
                        </div>
                    )}
                </div>
                
                <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-600">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 text-center">Actions</h2>
                    {saveStatus && <p className={`text-center text-sm mb-4 ${saveStatus.includes('Error') ? 'text-rose-500 dark:text-rose-400' : 'text-emerald-500 dark:text-emerald-400'}`}>{saveStatus}</p>}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-4">
                        <div className="flex flex-col space-y-4">
                            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 text-center md:text-left">Add Data</h3>
                            <div className="flex flex-col gap-4">
                               <button onClick={() => setModal(ModalType.INCOME)} className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105">
                                <PlusIcon /> Add Income
                            </button>
                            <button onClick={() => setModal(ModalType.EXPENSE)} className="flex items-center justify-center gap-2 bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105">
                                <PlusIcon /> Add Expense
                            </button>
                            </div>
                        </div>
                        <div className="flex flex-col space-y-4">
                            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 text-center md:text-left">Export Data</h3>
                            <div className="flex flex-col gap-4">
                                <button onClick={handleExportIncomeCSV} className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105">
                                    <DownloadIcon /> Export Income
                                </button>
                                <button onClick={handleExportExpenseCSV} className="flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105">
                                    <DownloadIcon /> Export Expense
                                </button>
                            </div>
                        </div>
                         <div className="flex flex-col space-y-4">
                            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 text-center md:text-left">Save &amp; Manage</h3>
                            <div className="flex flex-col gap-4">
                                <button onClick={handleSaveData} className="flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105">
                                    <SaveIcon /> Save Data
                                </button>
                                <button onClick={handleClearAllData} className="flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105">
                                    <TrashIcon /> Clear All Data
                                </button>
                            </div>
                        </div>
                        <div className="flex flex-col space-y-4">
                            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 text-center md:text-left">Budgeting</h3>
                             <button onClick={() => setModal(ModalType.MANAGE_GOALS)} className="h-full w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105">
                                <TargetIcon /> Manage Goals
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <BudgetGoals goals={goalsWithProgress} onManageClick={() => setModal(ModalType.MANAGE_GOALS)} formatCurrency={formatCurrency}/>
                    <IncomeGoals goals={incomeGoalsWithProgress} onManageClick={() => setModal(ModalType.MANAGE_GOALS)} formatCurrency={formatCurrency}/>
                </div>


                <HistorySummary data={history} formatCurrency={formatCurrency} />
                
                <TransactionList 
                  title="Income Details" 
                  transactions={filteredIncome} 
                  totalCount={income.length}
                  color="green" 
                  onEditClick={(transaction) => handleOpenEditModal(transaction, ModalType.INCOME)}
                  onDeleteClick={handleDeleteTransaction}
                  formatCurrency={formatCurrency}
                />
            </div>

            {/* Right Column: Expense Transactions */}
            <div className="lg:col-span-1">
                <TransactionList 
                  title="Expense Details" 
                  transactions={filteredExpenses} 
                  totalCount={expenses.length}
                  color="red" 
                  onEditClick={(transaction) => handleOpenEditModal(transaction, ModalType.EXPENSE)}
                  onDeleteClick={handleDeleteTransaction}
                  formatCurrency={formatCurrency}
                />
            </div>
          </div>
        </main>
      </div>
      
      {modal === ModalType.INCOME || modal === ModalType.EXPENSE ? (
        <TransactionModal
          isOpen={true}
          onClose={handleCloseModal}
          onSubmit={handleSubmitTransaction}
          type={modal}
          transactionToEdit={editingTransaction}
          categories={modal === ModalType.EXPENSE ? [...budgetGoals.map(g => g.category), 'Uncategorized'] : [...incomeGoals.map(g => g.category), 'Uncategorized']}
          currency={currency}
          convertFromBase={convertFromBase}
        />
      ) : null}

      {modal === ModalType.MANAGE_GOALS ? (
        <BudgetGoalModal
            isOpen={true}
            onClose={handleCloseModal}
            onSave={handleSaveAllGoals}
            initialGoals={budgetGoals}
            initialIncomeGoals={incomeGoals}
            currency={currency}
            convertFromBase={convertFromBase}
        />
      ) : null}

    </div>
  );
};

export default App;
