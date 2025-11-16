import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface SummaryPieChartProps {
  expenses: number;
  savings: number;
  formatCurrency: (amount: number) => string;
}

const COLORS = ['#f43f5e', '#38bdf8']; // Rose-500 for expenses, Sky-400 for savings

const CustomTooltip = ({ active, payload, formatCurrency }: any) => {
  if (active && payload && payload.length) {
    const total = payload.reduce((acc: number, entry: any) => acc + entry.value, 0);
    const data = payload[0];
    const percentage = ((data.value / total) * 100).toFixed(0);

    return (
      <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
        <p className="text-gray-800 dark:text-gray-200 font-semibold">{`${data.name}`}</p>
        <p className="text-gray-600 dark:text-gray-300">{`Amount: ${formatCurrency(data.value)}`}</p>
        <p className="text-gray-600 dark:text-gray-300">{`Contribution: ${percentage}%`}</p>
      </div>
    );
  }
  return null;
};


const ExpensesPieChart: React.FC<SummaryPieChartProps> = ({ expenses, savings, formatCurrency }) => {
  const pieChartData = useMemo(() => {
    const data = [];
    let total = expenses + (savings > 0 ? savings : 0);
    if(total === 0) total = 1; // Avoid division by zero

    if (expenses > 0) {
      data.push({ name: 'Expenses', value: expenses, percentage: (expenses / total * 100).toFixed(2) });
    }
    // Only show savings if it's a positive value
    if (savings > 0) {
      data.push({ name: 'Savings', value: savings, percentage: (savings / total * 100).toFixed(2) });
    }
    return data;
  }, [expenses, savings]);

  return (
    <div style={{ width: '100%', height: 350 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={pieChartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius="90%"
            innerRadius="60%"
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
            stroke="none"
            paddingAngle={5}
          >
            {pieChartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            cursor={{fill: 'transparent'}}
            content={<CustomTooltip formatCurrency={formatCurrency} />} 
          />
          <Legend wrapperStyle={{ color: 'var(--recharts-legend-text-color)' }} />
        </PieChart>
      </ResponsiveContainer>
      <style>{`
        :root {
          --recharts-legend-text-color: #4b5563; /* gray-600 */
        }
        .dark {
           --recharts-legend-text-color: #9ca3af; /* gray-400 */
        }
      `}</style>
    </div>
  );
};

export default ExpensesPieChart;