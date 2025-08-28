//HABITCARD 
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Edit, Trash2, Clock, Target, Calendar } from 'lucide-react';
import { useHabits } from '../../hooks/useHabits';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { NoteModal } from './NoteModal';

interface HabitCardProps {
  habit: any; // Using 'any' here for flexibility with backend data
  onEdit: (habit: any) => void;
  onDelete: (habitId: string) => void;
}

export const HabitCard: React.FC<HabitCardProps> = ({ habit, onEdit, onDelete }) => {
  const { toggleHabitCompletion, getHabitEntry, getHabitStreak } = useHabits();
  const [showNoteModal, setShowNoteModal] = useState(false);
  
  const today = format(new Date(), 'yyyy-MM-dd');
  const todayEntry = getHabitEntry(habit._id, today); // CHANGED: habit.id -> habit._id
  const streak = getHabitStreak(habit._id); // CHANGED: habit.id -> habit._id
  const isCompleted = todayEntry?.completed || false;

  const handleToggleCompletion = () => {
    if (isCompleted) {
      toggleHabitCompletion(habit._id, today, todayEntry?.note); // CHANGED: habit.id -> habit._id, pass note
    } else {
      setShowNoteModal(true);
    }
  };

  const handleCompleteWithNote = (note?: string) => {
    toggleHabitCompletion(habit._id, today, note); // CHANGED: habit.id -> habit._id
    setShowNoteModal(false);
  };

  const getFrequencyText = () => {
    switch (habit.frequency) {
      case 'daily':
        return 'Daily';
      case 'weekly':
      case 'custom':
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return habit.customDays?.map((day: string | number) => days[Number(day)]).join(', ') || 'Custom';
      default:
        return 'Daily';
    }
  };

  return (
    <>
      <Card hover className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{habit.emoji}</span>
            <div>
              <h3 className="font-semibold text-gray-900">{habit.name}</h3>
              <p className="text-sm text-gray-600">{habit.description}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(habit)}
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(habit._id)} // CHANGED: habit.id -> habit._id
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">{getFrequencyText()}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">{streak.current} day streak</span>
          </div>
          
          {habit.reminderTime && (
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">{habit.reminderTime}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Best streak: {streak.longest} days
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleToggleCompletion}
            className={`px-6 py-2 rounded-xl font-medium transition-all duration-200 ${
              isCompleted
                ? 'bg-green-100 text-green-800 border-2 border-green-200'
                : 'bg-gray-100 text-gray-700 border-2 border-gray-200 hover:bg-indigo-50 hover:border-indigo-200'
            }`}
          >
            {isCompleted ? '✓ Completed' : 'Mark Complete'}
          </motion.button>
        </div>

        {todayEntry?.note && (
          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> {todayEntry.note}
            </p>
          </div>
        )}
      </Card>

      <NoteModal
        isOpen={showNoteModal}
        onClose={() => setShowNoteModal(false)}
        onComplete={handleCompleteWithNote}
        habitName={habit.name}
      />
    </>
  );
};
