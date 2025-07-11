
'use client';

import Link from 'next/link';

interface Meal {
  id: string;
  name: string;
  calories: number;
  time: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

interface RecentMealsProps {
  meals: Meal[];
}

export default function RecentMeals({ meals }: RecentMealsProps) {
  const getMealIcon = (type: string) => {
    switch (type) {
      case 'breakfast': return 'ri-sun-line';
      case 'lunch': return 'ri-restaurant-line';
      case 'dinner': return 'ri-moon-line';
      case 'snack': return 'ri-cake-line';
      default: return 'ri-restaurant-line';
    }
  };

  const getMealColor = (type: string) => {
    switch (type) {
      case 'breakfast': return 'text-yellow-600 bg-yellow-100';
      case 'lunch': return 'text-blue-600 bg-blue-100';
      case 'dinner': return 'text-purple-600 bg-purple-100';
      case 'snack': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Recent Meals</h3>
          <Link href="/food-log">
            <button className="text-green-600 hover:text-green-700 text-sm font-medium cursor-pointer whitespace-nowrap">
              View All
            </button>
          </Link>
        </div>
      </div>
      <div className="p-6">
        {meals.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <i className="ri-restaurant-line text-2xl text-gray-400"></i>
            </div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">No meals logged yet</h4>
            <p className="text-gray-600 mb-4">Start tracking your meals to see them here</p>
            <Link href="/add-food">
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors cursor-pointer whitespace-nowrap">
                <i className="ri-add-line mr-2"></i>
                Log Your First Meal
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {meals.map((meal) => (
              <div key={meal.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getMealColor(meal.type)}`}>
                    <i className={`${getMealIcon(meal.type)} text-lg`}></i>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{meal.name}</h4>
                    <p className="text-sm text-gray-600 capitalize">{meal.type} • {meal.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{meal.calories}</p>
                  <p className="text-xs text-gray-600">calories</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
