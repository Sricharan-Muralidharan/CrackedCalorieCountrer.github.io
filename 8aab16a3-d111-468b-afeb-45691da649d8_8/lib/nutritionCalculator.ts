interface UserProfile {
  age: string;
  gender: string;
  height: string;
  weight: string;
  activityLevel: string;
  goal: string;
}

export function calculateRecommendedGoals(profile: UserProfile, isMetric: boolean) {
  const age = parseInt(profile.age);
  const height = parseFloat(profile.height);
  const weight = parseFloat(profile.weight);

  if (!age || !height || !weight) {
    return null;
  }

  // Convert to metric if needed
  let heightCm = height;
  let weightKg = weight;

  if (!isMetric) {
    heightCm = height * 2.54; // inches to cm
    weightKg = weight * 0.453592; // lbs to kg
  }

  // Calculate BMR using Mifflin-St Jeor Equation
  let bmr;
  if (profile.gender === 'male') {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  } else {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
  }

  // Apply activity multiplier
  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9
  };

  const tdee = bmr * (activityMultipliers[profile.activityLevel as keyof typeof activityMultipliers] || 1.55);

  // Adjust for goal
  let calories = tdee;
  switch (profile.goal) {
    case 'lose':
      calories = tdee - 500; // 1 lb per week deficit
      break;
    case 'gain':
      calories = tdee + 500; // 1 lb per week surplus
      break;
    default:
      calories = tdee;
  }

  // Calculate macros
  const protein = Math.round(weightKg * 2.2); // 1g per lb of body weight
  const fat = Math.round(calories * 0.25 / 9); // 25% of calories from fat
  const carbs = Math.round((calories - (protein * 4) - (fat * 9)) / 4); // Remaining calories from carbs

  return {
    calories: Math.round(calories),
    protein,
    carbs,
    fat,
    fiber: 25,
    sugar: Math.round(calories * 0.1 / 4), // 10% of calories from sugar
    sodium: 2300
  };
}