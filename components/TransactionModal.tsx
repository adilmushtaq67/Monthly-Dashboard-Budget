import React, { useState, useEffect } from 'react';
import { ModalType, Transaction, Currency } from '../types';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (type: ModalType.INCOME | ModalType.EXPENSE, amount: number, description: string, category?: string) => void;
  type: ModalType.INCOME | ModalType.EXPENSE;
  transactionToEdit?: Transaction | null;
  categories?: string[];
  currency: Currency;
  convertFromBase: (amount: number) => number;
}

const TransactionModal: React.FC<TransactionModalProps> = ({ isOpen, onClose, onSubmit, type, transactionToEdit, categories = [], currency, convertFromBase }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');

  const isEditing = !!transactionToEdit;
  const isIncome = type === ModalType.INCOME;
  
  useEffect(() => {
    if (isOpen) {
      if (isEditing && transactionToEdit) {
        setAmount(String(convertFromBase(transactionToEdit.amount).toFixed(2)));
        setDescription(transactionToEdit.description);
        setCategory(transactionToEdit.category || '');
      } else {
        setAmount('');
        setDescription('');
        setCategory('');
      }
    }
  }, [isOpen, isEditing, transactionToEdit, convertFromBase]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseFloat(amount);
    if (!isNaN(numericAmount) && numericAmount > 0 && description.trim()) {
      onSubmit(type, numericAmount, description.trim(), category);
      onClose();
    }
  };

  if (!isOpen) return null;
  
  const themeColor = isIncome ? 'emerald' : 'rose';
  const headerText = isEditing
    ? `Edit ${isIncome ? 'Income' : 'Expense'}`
    : `Add ${isIncome ? 'Income' : 'Expense'}`;
  const buttonText = isEditing ? 'Save Changes' : 'Add Transaction';
  const buttonClass = `w-full bg-${themeColor}-500 hover:bg-${themeColor}-600 text-white font-bold py-2 px-4 rounded-lg`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-700 rounded-lg shadow-xl p-6 w-full max-w-md m-4 transform transition-all animate-fade-in-up border border-gray-200 dark:border-gray-600">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{headerText}</h2>
          <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-100 text-2xl leading-none">&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="amount" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Amount in {currency}</label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 rounded-md p-2 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
              placeholder="e.g., 50.00"
              step="0.01"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Description</label>
            <input
              type="text"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 rounded-md p-2 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
              placeholder={isIncome ? "e.g., Monthly Salary" : "e.g., Groceries"}
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="category" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Category</label>
            <input
              type="text"
              id="category"
              list="category-list"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 rounded-md p-2 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
              placeholder="Select or type a category"
              required
            />
            <datalist id="category-list">
              {categories.map((cat) => (
                <option key={cat} value={cat} />
              ))}
            </datalist>
          </div>
          <button type="submit" className={buttonClass}>
            {buttonText}
          </button>
        </form>
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

export default TransactionModal;