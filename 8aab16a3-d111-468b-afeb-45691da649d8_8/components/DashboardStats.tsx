'use client';

interface StatsCardProps {
  title: string;
  value: string;
  icon: string;
  color: string;
  bgColor: string;
}

function StatsCard({ title, value, icon, color, bgColor }: StatsCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-2xl font-bold ${color} mt-1`}>{value}</p>
        </div>
        <div className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center`}>
          <i className={`${icon} text-xl text-white`}></i>
        </div>
      </div>
    </div>
  );
}

interface DashboardStatsProps {
  caloriesConsumed: number;
  caloriesRemaining: number;
  dailyGoal: number;
  protein: number;
  carbs: number;
  fat: number;
}

export default function DashboardStats({ 
  caloriesConsumed, 
  caloriesRemaining, 
  dailyGoal, 
  protein, 
  carbs, 
  fat 
}: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        title="Calories Consumed"
        value={caloriesConsumed.toString()}
        icon="ri-fire-line"
        color="text-red-600"
        bgColor="bg-red-500"
      />
      <StatsCard
        title="Calories Remaining"
        value={caloriesRemaining.toString()}
        icon="ri-subtract-line"
        color="text-blue-600"
        bgColor="bg-blue-500"
      />
      <StatsCard
        title="Daily Goal"
        value={dailyGoal.toString()}
        icon="ri-flag-line"
        color="text-green-600"
        bgColor="bg-green-500"
      />
      <StatsCard
        title="Protein (g)"
        value={protein.toString()}
        icon="ri-heart-pulse-line"
        color="text-purple-600"
        bgColor="bg-purple-500"
      />
    </div>
  );
}