//cal overview
import React from 'react';
import { motion } from 'framer-motion';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns';
import { Habit } from '../../types';
import { useHabits } from '../../hooks/useHabits';
import { Card } from '../ui/Card';

interface CalendarViewProps {
  habits: Habit[];
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  habits,
  selectedDate,
  onDateSelect
}) => {
  const { getHabitEntry } = useHabits();
  
  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getCompletionRate = (date: Date) => {
    if (!habits.length) return 0;
    
    const dateStr = format(date, 'yyyy-MM-dd');
    const completedCount = habits.reduce((count, habit) => {
      const entry = getHabitEntry(habit.id, dateStr);
      return count + (entry?.completed ? 1 : 0);
    }, 0);
    
    return completedCount / habits.length;
  };

  const getCompletionColor = (rate: number) => {
    if (rate === 0) return 'bg-gray-100';
    if (rate < 0.3) return 'bg-red-200';
    if (rate < 0.6) return 'bg-yellow-200';
    if (rate < 0.9) return 'bg-blue-200';
    return 'bg-green-200';
  };

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {format(selectedDate, 'MMMM yyyy')}
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Click on any day to see habit details
        </p>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-4">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 p-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map(day => {
          const completionRate = getCompletionRate(day);
          const isSelected = isSameDay(day, selectedDate);
          const isCurrentMonth = isSameMonth(day, selectedDate);
          
          return (
            <motion.button
              key={day.toISOString()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onDateSelect(day)}
              className={`
                p-3 rounded-lg text-sm font-medium transition-all duration-200 relative
                ${isSelected ? 'ring-2 ring-indigo-500' : ''}
                ${isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}
                ${getCompletionColor(completionRate)}
                hover:shadow-md
              `}
            >
              {format(day, 'd')}
              
              {completionRate > 0 && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full text-xs text-white flex items-center justify-center">
                  ✓
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-center space-x-4 text-xs text-gray-600">
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-gray-100 rounded"></div>
          <span>No habits</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-red-200 rounded"></div>
          <span>&lt;30%</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-yellow-200 rounded"></div>
          <span>30-60%</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-blue-200 rounded"></div>
          <span>60-90%</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-green-200 rounded"></div>
          <span>&gt;90%</span>
        </div>
      </div>
    </Card>
  );
};
