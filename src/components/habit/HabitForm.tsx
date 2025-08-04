import React, { useState, useEffect } from 'react';
import { Habit } from '../../types';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface HabitFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (habitData: Omit<Habit, 'id' | 'userId' | 'createdAt'>) => void;
  editingHabit?: Habit | null;
}

const EMOJI_OPTIONS = ['🏃‍♂️', '📚', '💧', '🧘‍♀️', '🍎', '💪', '🎯', '✍️', '🎨', '🌱', '🧠', '❤️'];
const DAY_OPTIONS = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
];

export const HabitForm: React.FC<HabitFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingHabit
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    emoji: '🎯',
    frequency: 'daily' as 'daily' | 'weekly' | 'custom',
    customDays: [] as number[],
    reminderTime: '',
  });

  useEffect(() => {
    if (editingHabit) {
      setFormData({
        name: editingHabit.name,
        description: editingHabit.description,
        emoji: editingHabit.emoji,
        frequency: editingHabit.frequency,
        customDays: editingHabit.customDays || [],
        reminderTime: editingHabit.reminderTime || '',
      });
    } else {
      setFormData({
        name: '',
        description: '',
        emoji: '🎯',
        frequency: 'daily',
        customDays: [],
        reminderTime: '',
      });
    }
  }, [editingHabit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) return;

    const habitData = {
      ...formData,
      name: formData.name.trim(),
      description: formData.description.trim(),
      customDays: formData.frequency === 'custom' ? formData.customDays : undefined,
      reminderTime: formData.reminderTime || undefined,
    };

    onSubmit(habitData);
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDayToggle = (day: number) => {
    setFormData(prev => ({
      ...prev,
      customDays: prev.customDays.includes(day)
        ? prev.customDays.filter(d => d !== day)
        : [...prev.customDays, day].sort()
    }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingHabit ? 'Edit Habit' : 'Add New Habit'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Input
              label="Habit Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Morning run, Read for 30 minutes"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your habit (optional)"
              className="block w-full px-3 py-2.5 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Choose Emoji
            </label>
            <div className="grid grid-cols-6 gap-2">
              {EMOJI_OPTIONS.map(emoji => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, emoji }))}
                  className={`p-3 text-xl rounded-lg border-2 transition-all duration-200 ${
                    formData.emoji === emoji
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Frequency
            </label>
            <select
              name="frequency"
              value={formData.frequency}
              onChange={handleChange}
              className="block w-full px-3 py-2.5 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="custom">Custom Days</option>
            </select>
          </div>

          {formData.frequency === 'custom' && (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Days
              </label>
              <div className="grid grid-cols-7 gap-2">
                {DAY_OPTIONS.map(day => (
                  <button
                    key={day.value}
                    type="button"
                    onClick={() => handleDayToggle(day.value)}
                    className={`p-2 text-sm rounded-lg border-2 transition-all duration-200 ${
                      formData.customDays.includes(day.value)
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {day.label.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="md:col-span-2">
            <Input
              label="Reminder Time (optional)"
              type="time"
              name="reminderTime"
              value={formData.reminderTime}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="flex space-x-3 pt-4">
          <Button
            type="submit"
            className="flex-1"
          >
            {editingHabit ? 'Update Habit' : 'Create Habit'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
};