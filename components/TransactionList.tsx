import React, { useState } from 'react';
import { Transaction } from '../types';
import { EditIcon, DeleteIcon } from './Icons';

interface TransactionListProps {
  title: string;
  transactions: Transaction[];
  totalCount: number;
  color: 'green' | 'red';
  onEditClick: (transaction: Transaction) => void;
  onDeleteClick: (id: number, type: 'income' | 'expense') => void;
  formatCurrency: (amount: number) => string;
}

const TransactionList: React.FC<TransactionListProps> = ({ title, transactions, totalCount, color, onEditClick, onDeleteClick, formatCurrency }) => {
  const [expandedRowId, setExpandedRowId] = useState<number | null>(null);

  const textColor = color === 'green' ? 'text-emerald-500 dark:text-emerald-400' : 'text-rose-500 dark:text-rose-400';
  const type = color === 'green' ? 'income' : 'expense';

  const handleRowClick = (id: number) => {
    setExpandedRowId(prevId => (prevId === id ? null : id));
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };
  
  return (
    <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-600 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{title}</h3>
        {totalCount > transactions.length && (
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Showing {transactions.length} of {totalCount}
          </span>
        )}
      </div>
      
      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300">
          <thead className="text-xs text-gray-600 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-800 sticky top-0">
            <tr>
              <th scope="col" className="px-4 py-3 text-center w-1/6">
                Date
              </th>
              <th scope="col" className="px-4 py-3 w-2/5">
                Description
              </th>
               <th scope="col" className="px-4 py-3 w-1/4">
                Category
              </th>
              <th scope="col" className="px-4 py-3 text-right w-1/5">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions.length > 0 ? (
              transactions.map((transaction) => {
                const isExpanded = expandedRowId === transaction.id;
                const formattedDate = new Date(transaction.timestamp);
                const date = `${formattedDate.getDate().toString().padStart(2, '0')} ${formattedDate.toLocaleString('default', { month: 'short' })}`;
                const time = formattedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

                return (
                  <React.Fragment key={transaction.id}>
                    <tr 
                      onClick={() => handleRowClick(transaction.id)}
                      className="bg-white dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer"
                    >
                      <td className="px-4 py-3 text-center text-gray-500 dark:text-gray-400 text-xs">
                        <p className="font-medium">{date}</p>
                        <p>{time}</p>
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100 whitespace-normal break-words">
                        {transaction.description}
                      </td>
                      <td className="px-4 py-3 text-gray-500 dark:text-gray-400 italic">
                        {transaction.category || 'N/A'}
                      </td>
                      <td className={`px-4 py-3 text-right font-bold ${textColor}`}>
                        {formatCurrency(transaction.amount)}
                      </td>
                    </tr>
                     <tr className="bg-white dark:bg-gray-700">
                        <td colSpan={4} className="p-0">
                            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isExpanded ? 'max-h-24' : 'max-h-0'}`}>
                                <div className="px-4 py-3 flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50">
                                    <div>
                                        <p><strong>Full Date:</strong> {formatDate(transaction.timestamp)}</p>
                                        <p><strong>Transaction ID:</strong> {transaction.id}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => onEditClick(transaction)} className="flex items-center gap-1.5 py-1 px-3 rounded-md bg-sky-100 dark:bg-sky-600/50 hover:bg-sky-200 dark:hover:bg-sky-600 text-sky-700 dark:text-sky-300 transition-colors">
                                            <EditIcon /> Edit
                                        </button>
                                        <button onClick={() => onDeleteClick(transaction.id, type)} className="flex items-center gap-1.5 py-1 px-3 rounded-md bg-rose-100 dark:bg-rose-600/50 hover:bg-rose-200 dark:hover:bg-rose-600 text-rose-700 dark:text-rose-300 transition-colors">
                                            <DeleteIcon /> Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </td>
                    </tr>
                  </React.Fragment>
                );
              })
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-8 text-gray-500 dark:text-gray-400">
                   No transactions to display.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionList;