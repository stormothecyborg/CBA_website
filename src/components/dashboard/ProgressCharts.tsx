import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { format, subDays, eachDayOfInterval } from 'date-fns';
import { useHabits } from '../../hooks/useHabits';
import { Card } from '../ui/Card';

export const ProgressCharts: React.FC = () => {
  const { habits, getHabitEntry } = useHabits();

  // Last 7 days
  const last7Days = eachDayOfInterval({
    start: subDays(new Date(), 6),
    end: new Date(),
  });

  const weeklyData = last7Days.map((date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const completedCount = habits.reduce((count, habit) => {
      const entry = getHabitEntry(habit.id, dateStr);
      return count + (entry?.completed ? 1 : 0);
    }, 0);

    const percentage =
      habits.length > 0
        ? Math.round((completedCount / habits.length) * 100)
        : 0;

    return {
      date: format(date, 'EEE'), // E.g. Mon, Tue
      completed: completedCount,
      total: habits.length,
      percentage,
    };
  });

  // Completion rate per habit (last 30 days)
  const habitData = habits.map((habit) => {
    const last30Days = eachDayOfInterval({
      start: subDays(new Date(), 29),
      end: new Date(),
    });

    const completedDays = last30Days.filter((date) => {
      const dateStr = format(date, 'yyyy-MM-dd');
      const entry = getHabitEntry(habit.id, dateStr);
      return entry?.completed;
    }).length;

    return {
      name: habit.name,
      emoji: habit.emoji,
      completionRate: Math.round((completedDays / 30) * 100),
    };
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Weekly Progress
        </h3>
        <div className="h-64" aria-label="Bar chart showing weekly habit completion">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip
                formatter={(value, name) =>
                  name === 'completed'
                    ? [`${value} habits`, 'Completed']
                    : [`${value}%`, 'Completion Rate']
                }
              />
              <Bar
                dataKey="completed"
                fill="#6366f1"
                radius={[4, 4, 0, 0]}
                animationDuration={500}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Completion Rate (7 days)
        </h3>
        <div className="h-64" aria-label="Line chart showing weekly percentage completion">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
              <Tooltip formatter={(value) => [`${value}%`, 'Completion']} />
              <Line
                type="monotone"
                dataKey="percentage"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ fill: '#10b981', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {habitData.length > 0 && (
        <Card className="p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Habit Performance (30 days)
          </h3>
          <div className="space-y-4">
            {habitData.map((habit, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{habit.emoji}</span>
                  <span className="font-medium text-gray-900">
                    {habit.name}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${habit.completionRate}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-600 w-12 text-right">
                    {habit.completionRate}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
