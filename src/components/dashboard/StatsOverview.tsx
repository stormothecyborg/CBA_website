import React from 'react';
import { motion } from 'framer-motion';
import { Target, TrendingUp, Calendar, Award, Star } from 'lucide-react';
import { format } from 'date-fns';
import { useHabits } from '../../hooks/useHabits';
import { Card } from '../ui/Card';

export const StatsOverview: React.FC = () => {
  const { habits, entries, streaks, getHabitEntry } = useHabits();
  
  const today = format(new Date(), 'yyyy-MM-dd');
  const todayCompletions = habits.filter(habit => 
    getHabitEntry(habit.id, today)?.completed
  ).length;

  const totalStreaks = streaks.reduce((sum, streak) => sum + streak.current, 0);
  const longestStreak = Math.max(...streaks.map(s => s.longest), 0);
  const completionRate = habits.length > 0 ? Math.round((todayCompletions / habits.length) * 100) : 0;

  // Find habit with longest streak (safe version)
  const longestStreakIndex = streaks.findIndex(s => s.longest === longestStreak);
  const longestStreakHabit = (longestStreakIndex !== -1 && habits[longestStreakIndex])
    ? habits[longestStreakIndex]
    : null;

  // Motivational message
  let motivationalMessage = "Start your day strong by completing a habit!";
  if (completionRate === 100) motivationalMessage = "Amazing! You completed all your habits today! 🎉";
  else if (completionRate >= 75) motivationalMessage = "Great job! Keep pushing for 100%! 💪";
  else if (completionRate >= 50) motivationalMessage = "Good progress! Stay consistent!";
  else if (completionRate > 0) motivationalMessage = "Every step counts. Keep going!";

  const stats = [
    {
      title: "Today's Progress",
      value: `${todayCompletions}/${habits.length}`,
      subtitle: `${completionRate}% complete`,
      icon: Target,
      color: 'text-blue-400',
      bgColor: 'bg-blue-900',
    },
    {
      title: 'Active Streaks',
      value: totalStreaks.toString(),
      subtitle: 'Days total',
      icon: TrendingUp,
      color: 'text-green-400',
      bgColor: 'bg-green-900',
    },
    {
      title: 'Total Habits',
      value: habits.length.toString(),
      subtitle: 'Active habits',
      icon: Calendar,
      color: 'text-purple-400',
      bgColor: 'bg-purple-900',
    },
    {
      title: 'Best Streak',
      value: longestStreak.toString(),
      subtitle: 'Days in a row',
      icon: Award,
      color: 'text-orange-400',
      bgColor: 'bg-orange-900',
    },
    longestStreakHabit && {
      title: 'Longest Streak Habit',
      value: longestStreakHabit.name,
      subtitle: `🔥 ${longestStreak} days`,
      icon: Star,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-900',
    }
  ].filter(Boolean);

  return (
    <div className="bg-gray-900 min-h-screen py-8">
      <Card className="mb-6 p-4 bg-gray-800 text-center text-indigo-200 font-semibold shadow">
        {motivationalMessage}
      </Card>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card hover className="p-6 bg-gray-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400">{stat.title}</p>
                    <p className="text-2xl font-bold text-indigo-100 mt-1">{stat.value}</p>
                    <p className="text-sm text-gray-400 mt-1">{stat.subtitle}</p>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
