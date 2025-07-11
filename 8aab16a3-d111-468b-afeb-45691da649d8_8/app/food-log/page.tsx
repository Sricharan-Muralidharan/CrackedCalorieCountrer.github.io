
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import { storageService, LoggedFood } from '@/lib/storage';

export default function FoodLogPage() {
  const [loggedFoods, setLoggedFoods] = useState<LoggedFood[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [filteredFoods, setFilteredFoods] = useState<LoggedFood[]>([]);
  const [selectedMealType, setSelectedMealType] = useState('all');

  useEffect(() => {
    const foods = storageService.getLoggedFoods();
    setLoggedFoods(foods);
  }, []);

  useEffect(() => {
    let filtered = loggedFoods.filter(food => food.date === selectedDate);
    
    if (selectedMealType !== 'all') {
      filtered = filtered.filter(food => food.mealType === selectedMealType);
    }
    
    setFilteredFoods(filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
  }, [loggedFoods, selectedDate, selectedMealType]);

  const deleteFood = (id: string) => {
    storageService.deleteLoggedFood(id);
    const updated = storageService.getLoggedFoods();
    setLoggedFoods(updated);
  };

  const getTotalNutrition = () => {
    return filteredFoods.reduce(
      (totals, food) => ({
        calories: totals.calories + (food.calories * food.quantity),
        protein: totals.protein + (food.protein * food.quantity),
        carbs: totals.carbs + (food.carbs * food.quantity),
        fat: totals.fat + (food.fat * food.quantity)
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  };

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

  const totalNutrition = getTotalNutrition();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Food Log</h1>
                <p className="text-gray-600 mt-2">View your eating history and nutrition details</p>
              </div>
              <Link href="/add-food">
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 cursor-pointer whitespace-nowrap">
                  <i className="ri-add-line mr-2"></i>
                  Add Food
                </button>
              </Link>
            </div>

            <div className="flex flex-wrap gap-4 items-center">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Meal Type</label>
                <select
                  value={selectedMealType}
                  onChange={(e) => setSelectedMealType(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent pr-8"
                >
                  <option value="all">All Meals</option>
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="snack">Snacks</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <i className="ri-fire-line text-red-600 text-xl"></i>
              </div>
              <p className="text-2xl font-bold text-gray-900">{Math.round(totalNutrition.calories)}</p>
              <p className="text-sm text-gray-600">Calories</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <i className="ri-drop-line text-blue-600 text-xl"></i>
              </div>
              <p className="text-2xl font-bold text-gray-900">{Math.round(totalNutrition.protein)}g</p>
              <p className="text-sm text-gray-600">Protein</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <i className="ri-plant-line text-yellow-600 text-xl"></i>
              </div>
              <p className="text-2xl font-bold text-gray-900">{Math.round(totalNutrition.carbs)}g</p>
              <p className="text-sm text-gray-600">Carbs</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <i className="ri-oil-line text-green-600 text-xl"></i>
              </div>
              <p className="text-2xl font-bold text-gray-900">{Math.round(totalNutrition.fat)}g</p>
              <p className="text-sm text-gray-600">Fat</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                Foods for {new Date(selectedDate).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </h3>
            </div>
            
            <div className="p-6">
              {filteredFoods.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <i className="ri-restaurant-line text-2xl text-gray-400"></i>
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No foods logged</h4>
                  <p className="text-gray-600 mb-4">
                    {selectedDate === new Date().toISOString().split('T')[0] 
                      ? "You haven't logged any foods today" 
                      : "No foods were logged on this date"}
                  </p>
                  <Link href="/add-food">
                    <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 cursor-pointer whitespace-nowrap">
                      <i className="ri-add-line mr-2"></i>
                      Add Food
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredFoods.map((food) => (
                    <div key={food.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getMealColor(food.mealType)}`}>
                          <i className={`${getMealIcon(food.mealType)} text-lg`}></i>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{food.name}</h4>
                          <p className="text-sm text-gray-600 capitalize">
                            {food.mealType} • {new Date(food.timestamp).toLocaleTimeString('en-US', { 
                              hour: 'numeric', 
                              minute: '2-digit' 
                            })}
                          </p>
                          <p className="text-xs text-gray-500">
                            Quantity: {food.quantity} • Protein: {Math.round(food.protein * food.quantity)}g • 
                            Carbs: {Math.round(food.carbs * food.quantity)}g • Fat: {Math.round(food.fat * food.quantity)}g
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">{Math.round(food.calories * food.quantity)}</p>
                          <p className="text-xs text-gray-600">calories</p>
                        </div>
                        <button
                          onClick={() => deleteFood(food.id)}
                          className="text-red-500 hover:text-red-700 cursor-pointer w-8 h-8 flex items-center justify-center"
                        >
                          <i className="ri-delete-bin-line"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
