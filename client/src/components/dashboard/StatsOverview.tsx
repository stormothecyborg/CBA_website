import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Target, TrendingUp, Calendar, Award } from 'lucide-react';
import { format } from 'date-fns';
import { useHabits } from '../../hooks/useHabits';
import { Card } from '../ui/Card';

export const StatsOverview: React.FC = () => {
  const { habits, entries, streaks, getHabitEntry } = useHabits();
  const today = format(new Date(), 'yyyy-MM-dd');
  const todayCompletions = habits.filter(habit => 
    getHabitEntry(habit._id, today)?.completed
  ).length;

  const totalStreaks = streaks.reduce((sum, s) => sum + s.current, 0);
  const longestStreak =
    streaks.length > 0 ? Math.max(...streaks.map((s) => s.longest)) : 0;
  const completionRate =
    habits.length > 0
      ? Math.round((todayCompletions / habits.length) * 100)
      : 0;

  const stats = [
    {
      title: "Today's Progress",
      value: `${todayCompletions}/${habits.length}`,
      subtitle: `${completionRate}% complete`,
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Active Streaks',
      value: totalStreaks.toString(),
      subtitle: 'Total ongoing days',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Total Habits',
      value: habits.length.toString(),
      subtitle: 'Currently tracked',
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Best Streak',
      value: longestStreak.toString(),
      subtitle: 'Top consistent record',
      icon: Award,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  // Motivational Quotes
  const quotes = [
    "Small daily improvements lead to big results.",
    "Consistency beats intensity.",
    "Every step counts, no matter how small.",
    "Your habits shape your future.",
    "Discipline is the bridge between goals and success."
  ];

  const [quote, setQuote] = useState('');

  useEffect(() => {
    // pick a random initial quote
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);

    // rotate quote every 10s
    const interval = setInterval(() => {
      setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Motivational Quote */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-4 rounded-xl shadow-md text-center"
      >
        <p className="text-lg font-semibold italic">“{quote}”</p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map(({ title, value, subtitle, icon: Icon, color, bgColor }, index) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            aria-label={`Stat card for ${title}`}
          >
            <Card hover className="p-6 rounded-xl shadow-sm bg-white transition-transform hover:scale-[1.02]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600">{title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
                  <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
                </div>
                <div className={`p-3 rounded-full ${bgColor}`}>
                  <Icon className={`w-6 h-6 ${color}`} />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
