
'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { storageService } from '@/lib/storage';
import { calculateRecommendedGoals } from '@/lib/nutritionCalculator';

export default function GoalsPage() {
  const [isMetric, setIsMetric] = useState(true);
  const [profile, setProfile] = useState({
    age: '',
    gender: 'male',
    height: '',
    weight: '',
    activityLevel: 'moderate',
    goal: 'maintain'
  });

  const [goals, setGoals] = useState({
    calories: 2000,
    protein: 150,
    carbs: 250,
    fat: 70,
    fiber: 25,
    sugar: 50,
    sodium: 2300
  });

  const [recommendedGoals, setRecommendedGoals] = useState(null);

  useEffect(() => {
    const savedProfile = storageService.getUserProfile();
    const savedGoals = storageService.getNutritionalGoals();

    if (savedProfile) {
      setProfile(savedProfile);
      setIsMetric(savedProfile.measurementSystem === 'metric');
    }

    if (savedGoals) {
      setGoals(savedGoals);
    }
  }, []);

  const handleProfileChange = (field: string, value: string) => {
    const updatedProfile = { ...profile, [field]: value };
    setProfile(updatedProfile);

    if (field === 'height' || field === 'weight' || field === 'age' || field === 'gender' || field === 'activityLevel' || field === 'goal') {
      const recommended = calculateRecommendedGoals(updatedProfile, isMetric);
      setRecommendedGoals(recommended);
    }
  };

  const handleGoalChange = (field: string, value: number) => {
    setGoals(prev => ({ ...prev, [field]: value }));
  };

  const handleUnitToggle = () => {
    const newIsMetric = !isMetric;
    setIsMetric(newIsMetric);

    // Convert existing height and weight values
    if (profile.height) {
      let newHeight;
      if (newIsMetric) {
        // Converting from imperial to metric (inches to cm)
        newHeight = Math.round(parseFloat(profile.height) * 2.54).toString();
      } else {
        // Converting from metric to imperial (cm to inches)
        newHeight = Math.round(parseFloat(profile.height) / 2.54).toString();
      }
      setProfile(prev => ({ ...prev, height: newHeight }));
    }

    if (profile.weight) {
      let newWeight;
      if (newIsMetric) {
        // Converting from imperial to metric (lbs to kg)
        newWeight = Math.round(parseFloat(profile.weight) * 0.453592).toString();
      } else {
        // Converting from metric to imperial (kg to lbs)
        newWeight = Math.round(parseFloat(profile.weight) / 0.453592).toString();
      }
      setProfile(prev => ({ ...prev, weight: newWeight }));
    }
  };

  const saveProfile = () => {
    const profileToSave = {
      ...profile,
      measurementSystem: isMetric ? 'metric' : 'imperial'
    };
    storageService.saveUserProfile(profileToSave);
    alert('Profile saved successfully!');
  };

  const saveGoals = () => {
    storageService.saveNutritionalGoals(goals);
    alert('Goals saved successfully!');
  };

  const useRecommendedGoals = () => {
    if (recommendedGoals) {
      setGoals(recommendedGoals);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Goals & Profile</h1>
            <p className="text-gray-600 mt-2">Set your nutritional goals and personal information</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Profile Section */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Personal Profile</h2>
                <div className="flex items-center space-x-2">
                  <span className={`text-sm ${!isMetric ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>Imperial</span>
                  <button
                    onClick={handleUnitToggle}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                      isMetric ? 'bg-green-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        isMetric ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                  <span className={`text-sm ${isMetric ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>Metric</span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                  <input
                    type="number"
                    value={profile.age}
                    onChange={(e) => handleProfileChange('age', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                    placeholder="Enter your age"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                  <select
                    value={profile.gender}
                    onChange={(e) => handleProfileChange('gender', e.target.value)}
                    className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Height {isMetric ? '(cm)' : '(inches)'}
                  </label>
                  <input
                    type="number"
                    value={profile.height}
                    onChange={(e) => handleProfileChange('height', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                    placeholder={isMetric ? "Enter height in cm" : "Enter height in inches"}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Weight {isMetric ? '(kg)' : '(lbs)'}
                  </label>
                  <input
                    type="number"
                    value={profile.weight}
                    onChange={(e) => handleProfileChange('weight', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                    placeholder={isMetric ? "Enter weight in kg" : "Enter weight in lbs"}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Activity Level</label>
                  <select
                    value={profile.activityLevel}
                    onChange={(e) => handleProfileChange('activityLevel', e.target.value)}
                    className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                  >
                    <option value="sedentary">Sedentary (little/no exercise)</option>
                    <option value="light">Light (1-3 days/week)</option>
                    <option value="moderate">Moderate (3-5 days/week)</option>
                    <option value="active">Active (6-7 days/week)</option>
                    <option value="very_active">Very Active (2x/day, intense)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Goal</label>
                  <select
                    value={profile.goal}
                    onChange={(e) => handleProfileChange('goal', e.target.value)}
                    className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                  >
                    <option value="lose">Lose Weight</option>
                    <option value="maintain">Maintain Weight</option>
                    <option value="gain">Gain Weight</option>
                  </select>
                </div>

                <button
                  onClick={saveProfile}
                  className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors cursor-pointer whitespace-nowrap"
                >
                  Save Profile
                </button>
              </div>
            </div>

            {/* Goals Section */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Nutritional Goals</h2>
                {recommendedGoals && (
                  <button
                    onClick={useRecommendedGoals}
                    className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-200 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Use Recommended
                  </button>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Daily Calories
                    {recommendedGoals && (
                      <span className="text-blue-600 text-xs ml-2">
                        (Recommended: {recommendedGoals.calories})
                      </span>
                    )}
                  </label>
                  <input
                    type="number"
                    value={goals.calories}
                    onChange={(e) => handleGoalChange('calories', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Protein (g)
                    {recommendedGoals && (
                      <span className="text-blue-600 text-xs ml-2">
                        (Recommended: {recommendedGoals.protein}g)
                      </span>
                    )}
                  </label>
                  <input
                    type="number"
                    value={goals.protein}
                    onChange={(e) => handleGoalChange('protein', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Carbohydrates (g)
                    {recommendedGoals && (
                      <span className="text-blue-600 text-xs ml-2">
                        (Recommended: {recommendedGoals.carbs}g)
                      </span>
                    )}
                  </label>
                  <input
                    type="number"
                    value={goals.carbs}
                    onChange={(e) => handleGoalChange('carbs', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fat (g)
                    {recommendedGoals && (
                      <span className="text-blue-600 text-xs ml-2">
                        (Recommended: {recommendedGoals.fat}g)
                      </span>
                    )}
                  </label>
                  <input
                    type="number"
                    value={goals.fat}
                    onChange={(e) => handleGoalChange('fat', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fiber (g)</label>
                  <input
                    type="number"
                    value={goals.fiber}
                    onChange={(e) => handleGoalChange('fiber', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sugar (g)</label>
                  <input
                    type="number"
                    value={goals.sugar}
                    onChange={(e) => handleGoalChange('sugar', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sodium (mg)</label>
                  <input
                    type="number"
                    value={goals.sodium}
                    onChange={(e) => handleGoalChange('sodium', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                  />
                </div>

                <button
                  onClick={saveGoals}
                  className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors cursor-pointer whitespace-nowrap"
                >
                  Save Goals
                </button>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          {recommendedGoals && (
            <div className="mt-8 bg-blue-50 rounded-lg border border-blue-200 p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">
                <i className="ri-lightbulb-line mr-2"></i>
                Recommended Goals Based on Your Profile
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-700">{recommendedGoals.calories}</div>
                  <div className="text-sm text-blue-600">Calories</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-700">{recommendedGoals.protein}g</div>
                  <div className="text-sm text-blue-600">Protein</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-700">{recommendedGoals.carbs}g</div>
                  <div className="text-sm text-blue-600">Carbs</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-700">{recommendedGoals.fat}g</div>
                  <div className="text-sm text-blue-600">Fat</div>
                </div>
              </div>
              <p className="text-sm text-blue-700 mt-4">
                These recommendations are based on your age, gender, height, weight, activity level, and goal.
                Click "Use Recommended" to apply these values to your goals.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
