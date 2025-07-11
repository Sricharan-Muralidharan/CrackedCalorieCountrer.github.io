
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { searchFoods, categories, Food } from '@/lib/foodDatabase';
import { storageService } from '@/lib/storage';

export default function AddFoodPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredFoods, setFilteredFoods] = useState<Food[]>([]);
  const [selectedFoods, setSelectedFoods] = useState<Array<Food & { quantity: number; mealType: string }>>([]);
  const [showAddedMessage, setShowAddedMessage] = useState(false);

  useEffect(() => {
    const foods = searchFoods(searchQuery, selectedCategory);
    setFilteredFoods(foods);
  }, [searchQuery, selectedCategory]);

  const addFood = (food: Food) => {
    const existingIndex = selectedFoods.findIndex(f => f.id === food.id);
    if (existingIndex >= 0) {
      const updated = [...selectedFoods];
      updated[existingIndex].quantity += 1;
      setSelectedFoods(updated);
    } else {
      setSelectedFoods([...selectedFoods, { ...food, quantity: 1, mealType: 'breakfast' }]);
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

  const updateMealType = (foodId: string, mealType: string) => {
    const updated = selectedFoods.map(f => 
      f.id === foodId ? { ...f, mealType } : f
    );
    setSelectedFoods(updated);
  };

  const getTotalCalories = () => {
    return selectedFoods.reduce((total, food) => total + (food.calories * food.quantity), 0);
  };

  const saveFoods = () => {
    if (selectedFoods.length === 0) return;

    const foodsToLog = selectedFoods.map(food => ({
      name: food.name,
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fat: food.fat,
      quantity: food.quantity,
      mealType: food.mealType as 'breakfast' | 'lunch' | 'dinner' | 'snack'
    }));

    storageService.addLoggedFoods(foodsToLog);

    setShowAddedMessage(true);
    setTimeout(() => {
      setShowAddedMessage(false);
      router.push('/');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <button 
              onClick={() => router.back()}
              className="flex items-center text-green-600 hover:text-green-700 mb-4 cursor-pointer"
            >
              <i className="ri-arrow-left-line mr-2"></i>
              Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Add Food</h1>
            <p className="text-gray-600 mt-2">Search and add foods to track your calories</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
                <div className="mb-6">
                  <div className="relative mb-4">
                    <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                    <input
                      type="text"
                      placeholder="Search for foods..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                    />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {categories.map(category => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-3 py-1 rounded-full text-sm cursor-pointer whitespace-nowrap ${
                          selectedCategory === category
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="max-h-96 overflow-y-auto">
                  <div className="space-y-2">
                    {filteredFoods.map(food => (
                      <div key={food.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{food.name}</h4>
                          <p className="text-sm text-gray-600">{food.serving} • {food.calories} calories</p>
                          <p className="text-xs text-gray-500">
                            Protein: {food.protein}g • Carbs: {food.carbs}g • Fat: {food.fat}g
                          </p>
                        </div>
                        <button
                          onClick={() => addFood(food)}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 cursor-pointer whitespace-nowrap"
                        >
                          <i className="ri-add-line"></i>
                        </button>
                      </div>
                    ))}
                    {filteredFoods.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        No foods found. Try a different search term or category.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6 h-fit">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Selected Foods</h3>

              {selectedFoods.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No foods selected yet</p>
              ) : (
                <>
                  <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                    {selectedFoods.map(food => (
                      <div key={food.id} className="border border-gray-200 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900 text-sm">{food.name}</h4>
                          <button
                            onClick={() => removeFood(food.id)}
                            className="text-red-500 hover:text-red-700 cursor-pointer"
                          >
                            <i className="ri-close-line"></i>
                          </button>
                        </div>

                        <div className="flex items-center space-x-2 mb-2">
                          <button
                            onClick={() => updateQuantity(food.id, food.quantity - 1)}
                            className="w-6 h-6 bg-gray-200 rounded text-gray-600 hover:bg-gray-300 cursor-pointer flex items-center justify-center"
                          >
                            -
                          </button>
                          <span className="text-sm font-medium">{food.quantity}</span>
                          <button
                            onClick={() => updateQuantity(food.id, food.quantity + 1)}
                            className="w-6 h-6 bg-gray-200 rounded text-gray-600 hover:bg-gray-300 cursor-pointer flex items-center justify-center"
                          >
                            +
                          </button>
                          <span className="text-xs text-gray-500 ml-2">
                            {food.calories * food.quantity} cal
                          </span>
                        </div>

                        <select
                          value={food.mealType}
                          onChange={(e) => updateMealType(food.id, e.target.value)}
                          className="w-full text-xs border border-gray-300 rounded px-2 py-1 pr-8"
                        >
                          <option value="breakfast">Breakfast</option>
                          <option value="lunch">Lunch</option>
                          <option value="dinner">Dinner</option>
                          <option value="snack">Snack</option>
                        </select>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-semibold text-gray-900">Total Calories:</span>
                      <span className="font-bold text-green-600 text-lg">{getTotalCalories()}</span>
                    </div>

                    <button
                      onClick={saveFoods}
                      className="w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 cursor-pointer whitespace-nowrap"
                    >
                      Add to Daily Log
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      {showAddedMessage && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg">
          <div className="flex items-center">
            <i className="ri-check-line mr-2"></i>
            Foods added successfully!
          </div>
        </div>
      )}
    </div>
  );
}
