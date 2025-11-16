import React from 'react';

interface MonthlySummary {
  month: string;
  year: number;
  totalIncome: number;
  totalExpenses: number;
  savings: number;
}

interface HistorySummaryProps {
  data: MonthlySummary[];
  formatCurrency: (amount: number) => string;
}

const HistorySummary: React.FC<HistorySummaryProps> = ({ data, formatCurrency }) => {
  return (
    <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-600">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Previous Months' Summary</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300">
          <thead className="text-xs text-gray-600 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-800">
            <tr>
              <th scope="col" className="px-4 py-3">
                Month
              </th>
              <th scope="col" className="px-4 py-3 text-right">
                Income
              </th>
              <th scope="col" className="px-4 py-3 text-right">
                Expenses
              </th>
              <th scope="col" className="px-4 py-3 text-right">
                Savings
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((summary, index) => (
              <tr key={index} className="bg-white dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600">
                <th scope="row" className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">
                  {summary.month}, {summary.year}
                </th>
                <td className="px-4 py-3 text-right text-emerald-500 dark:text-emerald-400">
                  {formatCurrency(summary.totalIncome)}
                </td>
                <td className="px-4 py-3 text-right text-rose-500 dark:text-rose-400">
                  {formatCurrency(summary.totalExpenses)}
                </td>
                <td className={`px-4 py-3 text-right font-medium ${summary.savings >= 0 ? 'text-sky-500 dark:text-sky-400' : 'text-amber-500 dark:text-amber-400'}`}>
                  {formatCurrency(summary.savings)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistorySummary;