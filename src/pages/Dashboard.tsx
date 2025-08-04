import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, LogOut, Calendar, BarChart3, Home } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useHabits } from '../hooks/useHabits';
import { Button } from '../components/ui/Button';
import { HabitCard } from '../components/habit/HabitCard';
import { HabitForm } from '../components/habit/HabitForm';
import { CalendarView } from '../components/habit/CalendarView';
import { ProgressCharts } from '../components/dashboard/ProgressCharts';
import { StatsOverview } from '../components/dashboard/StatsOverview';
import { Habit } from '../types';
import toast from 'react-hot-toast';

type View = 'dashboard' | 'calendar' | 'analytics';

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { habits, addHabit, updateHabit, deleteHabit } = useHabits();
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [showHabitForm, setShowHabitForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleAddHabit = (habitData: Omit<Habit, 'id' | 'userId' | 'createdAt'>) => {
    addHabit(habitData);
    toast.success('Habit added successfully!');
  };

  const handleEditHabit = (habit: Habit) => {
    setEditingHabit(habit);
    setShowHabitForm(true);
  };

  const handleUpdateHabit = (habitData: Omit<Habit, 'id' | 'userId' | 'createdAt'>) => {
    if (editingHabit) {
      updateHabit(editingHabit.id, habitData);
      toast.success('Habit updated successfully!');
      setEditingHabit(null);
    }
  };

  const handleDeleteHabit = (habitId: string) => {
    if (window.confirm('Are you sure you want to delete this habit?')) {
      deleteHabit(habitId);
      toast.success('Habit deleted successfully!');
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully!');
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="text-2xl">🎯</div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">HabitFlow</h1>
                <p className="text-sm text-gray-600">Welcome back, {user?.name}!</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                onClick={() => setShowHabitForm(true)}
                size="sm"
                className="flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Habit</span>
              </Button>
              
              <Button
                variant="ghost"
                onClick={handleLogout}
                size="sm"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {navItems.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id as View)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    currentView === item.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'dashboard' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <StatsOverview />
            
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Habits</h2>
              {habits.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-4xl mb-4">🌱</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No habits yet</h3>
                  <p className="text-gray-600 mb-4">Start building better habits today!</p>
                  <Button onClick={() => setShowHabitForm(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Habit
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {habits.map(habit => (
                    <HabitCard
                      key={habit.id}
                      habit={habit}
                      onEdit={handleEditHabit}
                      onDelete={handleDeleteHabit}
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {currentView === 'calendar' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <CalendarView
              habits={habits}
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
            />
          </motion.div>
        )}

        {currentView === 'analytics' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Analytics & Progress</h2>
              <ProgressCharts />
            </div>
          </motion.div>
        )}
      </main>

      {/* Habit Form Modal */}
      <HabitForm
        isOpen={showHabitForm}
        onClose={() => {
          setShowHabitForm(false);
          setEditingHabit(null);
        }}
        onSubmit={editingHabit ? handleUpdateHabit : handleAddHabit}
        editingHabit={editingHabit}
      />
    </div>
  );
};