
'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface CalorieProgressProps {
  consumed: number;
  goal: number;
  protein: number;
  carbs: number;
  fat: number;
}

export default function CalorieProgress({ consumed, goal, protein, carbs, fat }: CalorieProgressProps) {
  const remaining = Math.max(0, goal - consumed);
  const percentage = consumed > 0 ? Math.min(100, (consumed / goal) * 100) : 0;

  const pieData = [
    { name: 'Consumed', value: consumed, color: '#EF4444' },
    { name: 'Remaining', value: remaining, color: '#F3F4F6' }
  ];

  const macroData = [
    { name: 'Protein', value: protein, color: '#8B5CF6' },
    { name: 'Carbs', value: carbs, color: '#F59E0B' },
    { name: 'Fat', value: fat, color: '#10B981' }
  ];

  const hasData = consumed > 0 || protein > 0 || carbs > 0 || fat > 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Calorie Progress</h3>
        {!hasData ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <i className="ri-pie-chart-line text-3xl text-gray-400"></i>
            </div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">No calories logged today</h4>
            <p className="text-gray-600">Add your first meal to see your progress</p>
          </div>
        ) : (
          <>
            <div className="relative">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{Math.round(percentage)}%</div>
                  <div className="text-sm text-gray-600">of goal</div>
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-between text-sm">
              <span className="text-gray-600">Consumed: {consumed} cal</span>
              <span className="text-gray-600">Goal: {goal} cal</span>
            </div>
          </>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Macronutrient Breakdown</h3>
        {!hasData ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <i className="ri-bar-chart-line text-3xl text-gray-400"></i>
            </div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">No nutrition data yet</h4>
            <p className="text-gray-600">Track your meals to see macronutrient breakdown</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={macroData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8">
                {macroData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}