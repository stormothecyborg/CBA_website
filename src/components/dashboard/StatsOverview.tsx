import React from 'react';
import { motion } from 'framer-motion';
import { Target, TrendingUp, Calendar, Award } from 'lucide-react';
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

  const stats = [
    {
      title: 'Today\'s Progress',
      value: `${todayCompletions}/${habits.length}`,
      subtitle: `${completionRate}% complete`,
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Active Streaks',
      value: totalStreaks.toString(),
      subtitle: 'Days total',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Total Habits',
      value: habits.length.toString(),
      subtitle: 'Active habits',
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Best Streak',
      value: longestStreak.toString(),
      subtitle: 'Days in a row',
      icon: Award,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  return (
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
            <Card hover className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <p className="text-sm text-gray-500 mt-1">{stat.subtitle}</p>
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
  );
};