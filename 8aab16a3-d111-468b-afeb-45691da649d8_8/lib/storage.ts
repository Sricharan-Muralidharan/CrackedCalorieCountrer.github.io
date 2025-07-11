
interface LoggedFood {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  quantity: number;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  timestamp: string;
  date: string;
}

interface PlannedMeal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  quantity: number;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  plannedDate: string;
  foods: Array<{
    id: string;
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    quantity: number;
  }>;
}

interface UserProfile {
  age: string;
  gender: string;
  height: string;
  weight: string;
  activityLevel: string;
  goal: string;
  measurementSystem: 'metric' | 'imperial';
}

interface NutritionalGoals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
}

const STORAGE_KEYS = {
  LOGGED_FOODS: 'calorie_tracker_logged_foods',
  MEAL_PLANS: 'calorie_tracker_meal_plans',
  USER_PROFILE: 'calorie_tracker_user_profile',
  NUTRITIONAL_GOALS: 'calorie_tracker_nutritional_goals'
};

export const storageService = {
  // Logged Foods
  getLoggedFoods: (): LoggedFood[] => {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(STORAGE_KEYS.LOGGED_FOODS);
    return stored ? JSON.parse(stored) : [];
  },

  addLoggedFoods: (foods: Omit<LoggedFood, 'id' | 'timestamp' | 'date'>[]) => {
    const existing = storageService.getLoggedFoods();
    const now = new Date();
    const today = now.toISOString().split('T')[0];

    const newFoods = foods.map(food => ({
      ...food,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: now.toISOString(),
      date: today
    }));

    const updated = [...existing, ...newFoods];
    localStorage.setItem(STORAGE_KEYS.LOGGED_FOODS, JSON.stringify(updated));
    return updated;
  },

  getTodaysLoggedFoods: (): LoggedFood[] => {
    const today = new Date().toISOString().split('T')[0];
    return storageService.getLoggedFoods().filter(food => food.date === today);
  },

  deleteLoggedFood: (id: string) => {
    const existing = storageService.getLoggedFoods();
    const updated = existing.filter(food => food.id !== id);
    localStorage.setItem(STORAGE_KEYS.LOGGED_FOODS, JSON.stringify(updated));
    return updated;
  },

  // Meal Plans
  getMealPlans: (): PlannedMeal[] => {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(STORAGE_KEYS.MEAL_PLANS);
    return stored ? JSON.parse(stored) : [];
  },

  addMealPlan: (mealPlan: Omit<PlannedMeal, 'id'>) => {
    const existing = storageService.getMealPlans();
    const newPlan = {
      ...mealPlan,
      id: `plan-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };

    const updated = [...existing, newPlan];
    localStorage.setItem(STORAGE_KEYS.MEAL_PLANS, JSON.stringify(updated));
    return updated;
  },

  deleteMealPlan: (id: string) => {
    const existing = storageService.getMealPlans();
    const updated = existing.filter(plan => plan.id !== id);
    localStorage.setItem(STORAGE_KEYS.MEAL_PLANS, JSON.stringify(updated));
    return updated;
  },

  getMealPlansForDate: (date: string): PlannedMeal[] => {
    return storageService.getMealPlans().filter(plan => plan.plannedDate === date);
  },

  // User Profile
  getUserProfile: (): UserProfile | null => {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    return stored ? JSON.parse(stored) : null;
  },

  saveUserProfile: (profile: UserProfile) => {
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
  },

  // Nutritional Goals
  getNutritionalGoals: (): NutritionalGoals | null => {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem(STORAGE_KEYS.NUTRITIONAL_GOALS);
    return stored ? JSON.parse(stored) : null;
  },

  saveNutritionalGoals: (goals: NutritionalGoals) => {
    localStorage.setItem(STORAGE_KEYS.NUTRITIONAL_GOALS, JSON.stringify(goals));
  }
};

export type { LoggedFood, PlannedMeal, UserProfile, NutritionalGoals };
