
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import DashboardStats from '@/components/DashboardStats';
import CalorieProgress from '@/components/CalorieProgress';
import RecentMeals from '@/components/RecentMeals';
import { storageService } from '@/lib/storage';

export default function Home() {
  const [todayStats, setTodayStats] = useState({
    caloriesConsumed: 0,
    dailyGoal: 2000,
    caloriesRemaining: 2000,
    protein: 0,
    carbs: 0,
    fat: 0
  });

  const [recentMeals, setRecentMeals] = useState<Array<{
    id: string;
    name: string;
    calories: number;
    time: string;
    type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  }>>([]);

  useEffect(() => {
    const loadTodaysData = () => {
      const todaysFood = storageService.getTodaysLoggedFoods();
      const savedGoals = storageService.getNutritionalGoals();

      const dailyGoal = savedGoals ? savedGoals.calories : 2000;

      const totalCalories = todaysFood.reduce((sum, food) => sum + (food.calories * food.quantity), 0);
      const totalProtein = todaysFood.reduce((sum, food) => sum + (food.protein * food.quantity), 0);
      const totalCarbs = todaysFood.reduce((sum, food) => sum + (food.carbs * food.quantity), 0);
      const totalFat = todaysFood.reduce((sum, food) => sum + (food.fat * food.quantity), 0);

      setTodayStats({
        caloriesConsumed: Math.round(totalCalories),
        dailyGoal: dailyGoal,
        caloriesRemaining: Math.max(0, dailyGoal - Math.round(totalCalories)),
        protein: Math.round(totalProtein),
        carbs: Math.round(totalCarbs),
        fat: Math.round(totalFat)
      });

      const meals = todaysFood.map(food => ({
        id: food.id,
        name: food.name,
        calories: Math.round(food.calories * food.quantity),
        time: new Date(food.timestamp).toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit' 
        }),
        type: food.mealType
      })).slice(0, 5);

      setRecentMeals(meals);
    };

    loadTodaysData();

    const interval = setInterval(loadTodaysData, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-2">Track your daily nutrition and reach your goals</p>
          </div>

          <DashboardStats
            caloriesConsumed={todayStats.caloriesConsumed}
            caloriesRemaining={todayStats.caloriesRemaining}
            dailyGoal={todayStats.dailyGoal}
            protein={todayStats.protein}
            carbs={todayStats.carbs}
            fat={todayStats.fat}
          />

          <div className="mt-8">
            <CalorieProgress
              consumed={todayStats.caloriesConsumed}
              goal={todayStats.dailyGoal}
              protein={todayStats.protein}
              carbs={todayStats.carbs}
              fat={todayStats.fat}
            />
          </div>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <RecentMeals meals={recentMeals} />
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link href="/add-food">
                  <button className="w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors cursor-pointer whitespace-nowrap">
                    <i className="ri-add-line mr-2"></i>
                    Add Food
                  </button>
                </Link>
                <Link href="/meal-plan">
                  <button className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap">
                    <i className="ri-calendar-line mr-2"></i>
                    Plan Meals
                  </button>
                </Link>
                <Link href="/goals">
                  <button className="w-full bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition-colors cursor-pointer whitespace-nowrap">
                    <i className="ri-settings-line mr-2"></i>
                    Update Goals
                  </button>
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Progress</h3>
            <div className="grid grid-cols-7 gap-2">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
                const progress = todayStats.caloriesConsumed > 0 && index === new Date().getDay() - 1 
                  ? Math.min(100, (todayStats.caloriesConsumed / todayStats.dailyGoal) * 100) : 0;
                return (
                  <div key={day} className="text-center">
                    <div className="text-xs font-medium text-gray-600 mb-2">{day}</div>
                    <div className="h-20 bg-gray-200 rounded-lg relative overflow-hidden">
                      <div 
                        className="absolute bottom-0 left-0 right-0 bg-green-500 transition-all"
                        style={{ height: `${progress}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-600 mt-1">{Math.round(progress)}%</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
