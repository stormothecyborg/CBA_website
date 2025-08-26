import React from 'react';
import {
  format,
  subDays,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  startOfMonth,
  endOfMonth,
  parseISO,
} from 'date-fns';
import { useHabits } from '../../hooks/useHabits';
import { Card } from '../ui/Card';
import { motion } from 'framer-motion';

interface CalendarViewProps {
  habits: any[]; // Changed type to 'any' for compatibility
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  habits,
  selectedDate,
  onDateSelect
}) => {
  const { entries } = useHabits(); // Get entries from the hook

  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getCompletionRate = (date: Date) => {
    if (!habits.length) return 0;
    
    const dateStr = format(date, 'yyyy-MM-dd');
    const completedCount = entries.filter(entry => entry.date === dateStr).length;
    
    return completedCount / habits.length;
  };

  const getCompletionColor = (rate: number) => {
    if (rate === 0) return 'bg-gray-100';
    if (rate < 0.3) return 'bg-red-200';
    if (rate < 0.6) return 'bg-yellow-200';
    if (rate < 0.9) return 'bg-blue-200';
    return 'bg-green-200';
  };

  const completedHabitsForDay = habits.filter(habit => 
    entries.some(entry => 
      entry.habitId === habit._id && isSameDay(parseISO(entry.date), selectedDate)
    )
  );

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

      {/* NEW: Habit details for the selected day */}
      {completedHabitsForDay.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Completed on {format(selectedDate, 'PP')}
          </h3>
          <ul className="space-y-4">
            {completedHabitsForDay.map(habit => {
              const entry = entries.find(e => 
                e.habitId === habit._id && isSameDay(parseISO(e.date), selectedDate)
              );
              return (
                <li key={habit._id} className="bg-gray-50 p-4 rounded-lg shadow-sm">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{habit.emoji}</span>
                    <span className="font-medium text-gray-900">{habit.name}</span>
                  </div>
                  {entry?.note && (
                    <p className="text-sm text-gray-600 mt-2">
                      <strong>Note:</strong> {entry.note}
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}

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