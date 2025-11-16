import React from 'react';

interface SummaryCardProps {
  title: string;
  amount: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, amount, icon, color, bgColor }) => {
  return (
    <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-600 flex items-center space-x-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-gray-400 dark:hover:border-gray-500">
      <div className={`p-3 rounded-full ${bgColor}`}>
        <div className={color}>
          {icon}
        </div>
      </div>
      <div>
        <p className="text-gray-500 dark:text-gray-400 text-sm">{title}</p>
        <p className={`text-2xl font-bold ${color}`}>
          {amount}
        </p>
      </div>
    </div>
  );
};

export default SummaryCard;
