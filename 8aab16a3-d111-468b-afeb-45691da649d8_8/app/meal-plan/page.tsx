
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import { searchFoods, categories, Food } from '@/lib/foodDatabase';
import { storageService, PlannedMeal } from '@/lib/storage';

export default function MealPlanPage() {
  const [selectedDate, setSelectedDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  
  const [mealPlans, setMealPlans] = useState<PlannedMeal[]>([]);
  const [isPlanning, setIsPlanning] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredFoods, setFilteredFoods] = useState<Food[]>([]);
  const [selectedFoods, setSelectedFoods] = useState<Array<Food & { quantity: number }>>([]);
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');
  const [mealName, setMealName] = useState('');

  useEffect(() => {
    loadMealPlans();
  }, [selectedDate]);

  useEffect(() => {
    const foods = searchFoods(searchQuery, selectedCategory);
    setFilteredFoods(foods);
  }, [searchQuery, selectedCategory]);

  const loadMealPlans = () => {
    const plans = storageService.getMealPlansForDate(selectedDate);
    setMealPlans(plans);
  };

  const addFood = (food: Food) => {
    const existingIndex = selectedFoods.findIndex(f => f.id === food.id);
    if (existingIndex >= 0) {
      const updated = [...selectedFoods];
      updated[existingIndex].quantity += 1;
      setSelectedFoods(updated);
    } else {
      setSelectedFoods([...selectedFoods, { ...food, quantity: 1 }]);
    }
  };

  const removeFood = (foodId: string) => {
    setSelectedFoods(selectedFoods.filter(f => f.id !== foodId));
  };

  const updateQuantity = (foodId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFood(foodId);
      return;
    }
    const updated = selectedFoods.map(f => 
      f.id === foodId ? { ...f, quantity } : f
    );
    setSelectedFoods(updated);
  };

  const getTotalNutrition = (foods: Array<Food & { quantity: number }>) => {
    return foods.reduce(
      (totals, food) => ({
        calories: totals.calories + (food.calories * food.quantity),
        protein: totals.protein + (food.protein * food.quantity),
        carbs: totals.carbs + (food.carbs * food.quantity),
        fat: totals.fat + (food.fat * food.quantity)
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  };

  const saveMealPlan = () => {
    if (selectedFoods.length === 0 || !mealName.trim()) return;

    const totalNutrition = getTotalNutrition(selectedFoods);
    
    const mealPlan: Omit<PlannedMeal, 'id'> = {
      name: mealName,
      calories: totalNutrition.calories,
      protein: totalNutrition.protein,
      carbs: totalNutrition.carbs,
      fat: totalNutrition.fat,
      quantity: 1,
      mealType,
      plannedDate: selectedDate,
      foods: selectedFoods.map(food => ({
        id: food.id,
        name: food.name,
        calories: food.calories,
        protein: food.protein,
        carbs: food.carbs,
        fat: food.fat,
        quantity: food.quantity
      }))
    };

    storageService.addMealPlan(mealPlan);
    
    setSelectedFoods([]);
    setMealName('');
    setIsPlanning(false);
    loadMealPlans();
  };

  const deleteMealPlan = (id: string) => {
    storageService.deleteMealPlan(id);
    loadMealPlans();
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

  const totalPlannedNutrition = getTotalNutrition(
    mealPlans.flatMap(plan => plan.foods)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Meal Plan</h1>
                <p className="text-gray-600 mt-2">Plan your future meals and nutrition</p>
              </div>
              <button
                onClick={() => setIsPlanning(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer whitespace-nowrap"
              >
                <i className="ri-add-line mr-2"></i>
                Plan Meal
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Plan Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <i className="ri-fire-line text-red-600 text-xl"></i>
              </div>
              <p className="text-2xl font-bold text-gray-900">{Math.round(totalPlannedNutrition.calories)}</p>
              <p className="text-sm text-gray-600">Planned Calories</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <i className="ri-drop-line text-blue-600 text-xl"></i>
              </div>
              <p className="text-2xl font-bold text-gray-900">{Math.round(totalPlannedNutrition.protein)}g</p>
              <p className="text-sm text-gray-600">Protein</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <i className="ri-plant-line text-yellow-600 text-xl"></i>
              </div>
              <p className="text-2xl font-bold text-gray-900">{Math.round(totalPlannedNutrition.carbs)}g</p>
              <p className="text-sm text-gray-600">Carbs</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <i className="ri-oil-line text-green-600 text-xl"></i>
              </div>
              <p className="text-2xl font-bold text-gray-900">{Math.round(totalPlannedNutrition.fat)}g</p>
              <p className="text-sm text-gray-600">Fat</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                Meal Plans for {new Date(selectedDate).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </h3>
            </div>
            
            <div className="p-6">
              {mealPlans.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <i className="ri-calendar-line text-2xl text-gray-400"></i>
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No meals planned</h4>
                  <p className="text-gray-600 mb-4">Start planning your meals for this date</p>
                  <button
                    onClick={() => setIsPlanning(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer whitespace-nowrap"
                  >
                    <i className="ri-add-line mr-2"></i>
                    Plan Your First Meal
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {mealPlans.map((plan) => (
                    <div key={plan.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getMealColor(plan.mealType)}`}>
                            <i className={`${getMealIcon(plan.mealType)} text-lg`}></i>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{plan.name}</h4>
                            <p className="text-sm text-gray-600 capitalize">{plan.mealType}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">{Math.round(plan.calories)} cal</p>
                            <p className="text-xs text-gray-600">
                              P: {Math.round(plan.protein)}g • C: {Math.round(plan.carbs)}g • F: {Math.round(plan.fat)}g
                            </p>
                          </div>
                          <button
                            onClick={() => deleteMealPlan(plan.id)}
                            className="text-red-500 hover:text-red-700 cursor-pointer w-8 h-8 flex items-center justify-center"
                          >
                            <i className="ri-delete-bin-line"></i>
                          </button>
                        </div>
                      </div>
                      
                      <div className="ml-15 space-y-2">
                        {plan.foods.map((food, index) => (
                          <div key={index} className="text-sm text-gray-600 flex justify-between">
                            <span>{food.name} (x{food.quantity})</span>
                            <span>{Math.round(food.calories * food.quantity)} cal</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {isPlanning && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Plan New Meal</h3>
                <button
                  onClick={() => {
                    setIsPlanning(false);
                    setSelectedFoods([]);
                    setMealName('');
                  }}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <i className="ri-close-line text-xl"></i>
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Meal Name</label>
                  <input
                    type="text"
                    value={mealName}
                    onChange={(e) => setMealName(e.target.value)}
                    placeholder="e.g., Healthy Breakfast Bowl"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Meal Type</label>
                  <select
                    value={mealType}
                    onChange={(e) => setMealType(e.target.value as any)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-8"
                  >
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="snack">Snack</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Add Foods</h4>
                  
                  <div className="mb-4">
                    <div className="relative mb-3">
                      <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                      <input
                        type="text"
                        placeholder="Search for foods..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {categories.slice(0, 5).map(category => (
                        <button
                          key={category}
                          onClick={() => setSelectedCategory(category)}
                          className={`px-2 py-1 rounded-full text-xs cursor-pointer whitespace-nowrap ${
                            selectedCategory === category
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="max-h-64 overflow-y-auto space-y-2">
                    {filteredFoods.slice(0, 10).map(food => (
                      <div key={food.id} className="flex items-center justify-between p-2 border border-gray-200 rounded hover:bg-gray-50">
                        <div className="flex-1 min-w-0">
                          <h5 className="font-medium text-gray-900 text-sm truncate">{food.name}</h5>
                          <p className="text-xs text-gray-600">{food.calories} cal</p>
                        </div>
                        <button
                          onClick={() => addFood(food)}
                          className="bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700 cursor-pointer whitespace-nowrap"
                        >
                          <i className="ri-add-line"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Selected Foods</h4>
                  
                  {selectedFoods.length === 0 ? (
                    <p className="text-gray-500 text-sm">No foods selected yet</p>
                  ) : (
                    <>
                      <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                        {selectedFoods.map(food => (
                          <div key={food.id} className="flex items-center justify-between p-2 border border-gray-200 rounded">
                            <div className="flex-1 min-w-0">
                              <h5 className="font-medium text-gray-900 text-sm truncate">{food.name}</h5>
                              <p className="text-xs text-gray-600">{Math.round(food.calories * food.quantity)} cal</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => updateQuantity(food.id, food.quantity - 1)}
                                className="w-6 h-6 bg-gray-200 rounded text-gray-600 hover:bg-gray-300 cursor-pointer flex items-center justify-center text-xs"
                              >
                                -
                              </button>
                              <span className="text-sm font-medium w-8 text-center">{food.quantity}</span>
                              <button
                                onClick={() => updateQuantity(food.id, food.quantity + 1)}
                                className="w-6 h-6 bg-gray-200 rounded text-gray-600 hover:bg-gray-300 cursor-pointer flex items-center justify-center text-xs"
                              >
                                +
                              </button>
                              <button
                                onClick={() => removeFood(food.id)}
                                className="text-red-500 hover:text-red-700 cursor-pointer ml-2"
                              >
                                <i className="ri-close-line text-sm"></i>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-3 mb-4">
                        <h5 className="font-medium text-gray-900 mb-2 text-sm">Total Nutrition</h5>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>Calories: {Math.round(getTotalNutrition(selectedFoods).calories)}</div>
                          <div>Protein: {Math.round(getTotalNutrition(selectedFoods).protein)}g</div>
                          <div>Carbs: {Math.round(getTotalNutrition(selectedFoods).carbs)}g</div>
                          <div>Fat: {Math.round(getTotalNutrition(selectedFoods).fat)}g</div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                <button
                  onClick={() => {
                    setIsPlanning(false);
                    setSelectedFoods([]);
                    setMealName('');
                  }}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer whitespace-nowrap"
                >
                  Cancel
                </button>
                <button
                  onClick={saveMealPlan}
                  disabled={selectedFoods.length === 0 || !mealName.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap"
                >
                  Save Meal Plan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
