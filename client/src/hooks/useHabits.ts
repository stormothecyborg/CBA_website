import { useState, useEffect } from 'react';
import { Habit, HabitEntry, HabitStreak } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { format, isToday, parseISO, differenceInDays } from 'date-fns';

export const useHabits = () => {
  const { user } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [entries, setEntries] = useState<HabitEntry[]>([]);
  const [streaks, setStreaks] = useState<HabitStreak[]>([]);

  useEffect(() => {
    if (user) {
      loadHabits();
      loadEntries();
    }
  }, [user]);

  useEffect(() => {
    calculateStreaks();
  }, [habits, entries]);

  const loadHabits = () => {
    const savedHabits = localStorage.getItem('habit-tracker-habits');
    if (savedHabits) {
      const parsedHabits = JSON.parse(savedHabits).map((habit: any) => ({
        ...habit,
        createdAt: new Date(habit.createdAt)
      }));
      setHabits(parsedHabits.filter((habit: Habit) => habit.userId === user?.id));
    }
  };

  const loadEntries = () => {
    const savedEntries = localStorage.getItem('habit-tracker-entries');
    if (savedEntries) {
      const parsedEntries = JSON.parse(savedEntries).map((entry: any) => ({
        ...entry,
        completedAt: entry.completedAt ? new Date(entry.completedAt) : undefined
      }));
      setEntries(parsedEntries);
    }
  };

  const saveHabits = (newHabits: Habit[]) => {
    const allHabits = JSON.parse(localStorage.getItem('habit-tracker-habits') || '[]');
    const filteredHabits = allHabits.filter((habit: Habit) => habit.userId !== user?.id);
    const updatedHabits = [...filteredHabits, ...newHabits];
    localStorage.setItem('habit-tracker-habits', JSON.stringify(updatedHabits));
  };

  const saveEntries = (newEntries: HabitEntry[]) => {
    localStorage.setItem('habit-tracker-entries', JSON.stringify(newEntries));
  };

  const addHabit = (habitData: Omit<Habit, 'id' | 'userId' | 'createdAt'>) => {
    if (!user) return;

    const newHabit: Habit = {
      ...habitData,
      id: `habit_${Date.now()}`,
      userId: user.id,
      createdAt: new Date(),
    };

    const updatedHabits = [...habits, newHabit];
    setHabits(updatedHabits);
    saveHabits(updatedHabits);
  };

  const updateHabit = (habitId: string, habitData: Partial<Habit>) => {
    const updatedHabits = habits.map(habit =>
      habit.id === habitId ? { ...habit, ...habitData } : habit
    );
    setHabits(updatedHabits);
    saveHabits(updatedHabits);
  };

  const deleteHabit = (habitId: string) => {
    const updatedHabits = habits.filter(habit => habit.id !== habitId);
    const updatedEntries = entries.filter(entry => entry.habitId !== habitId);
    
    setHabits(updatedHabits);
    setEntries(updatedEntries);
    saveHabits(updatedHabits);
    saveEntries(updatedEntries);
  };

  const toggleHabitCompletion = (habitId: string, date: string, note?: string) => {
    const existingEntry = entries.find(
      entry => entry.habitId === habitId && entry.date === date
    );

    let updatedEntries: HabitEntry[];

    if (existingEntry) {
      updatedEntries = entries.map(entry =>
        entry.id === existingEntry.id
          ? {
              ...entry,
              completed: !entry.completed,
              note: note || entry.note,
              completedAt: !entry.completed ? new Date() : undefined
            }
          : entry
      );
    } else {
      const newEntry: HabitEntry = {
        id: `entry_${Date.now()}`,
        habitId,
        date,
        completed: true,
        note,
        completedAt: new Date(),
      };
      updatedEntries = [...entries, newEntry];
    }

    setEntries(updatedEntries);
    saveEntries(updatedEntries);
  };

  const calculateStreaks = () => {
    const newStreaks: HabitStreak[] = habits.map(habit => {
      const habitEntries = entries
        .filter(entry => entry.habitId === habit.id && entry.completed)
        .sort((a, b) => b.date.localeCompare(a.date));

      if (habitEntries.length === 0) {
        return { habitId: habit.id, current: 0, longest: 0 };
      }

      let current = 0;
      let longest = 0;
      let currentStreak = 0;
      
      const today = format(new Date(), 'yyyy-MM-dd');
      const yesterday = format(new Date(Date.now() - 24 * 60 * 60 * 1000), 'yyyy-MM-dd');
      
      // Check if habit was completed today or yesterday to maintain streak
      const hasRecentCompletion = habitEntries.some(entry => 
        entry.date === today || entry.date === yesterday
      );

      if (hasRecentCompletion) {
        // Calculate current streak
        let checkDate = new Date();
        for (let i = 0; i < 365; i++) { // Check up to a year back
          const dateStr = format(checkDate, 'yyyy-MM-dd');
          const hasEntry = habitEntries.some(entry => entry.date === dateStr);
          
          if (hasEntry) {
            currentStreak++;
          } else {
            break;
          }
          
          checkDate = new Date(checkDate.getTime() - 24 * 60 * 60 * 1000);
        }
      }

      // Calculate longest streak
      let tempStreak = 0;
      let lastDate: Date | null = null;

      habitEntries.reverse().forEach(entry => {
        const entryDate = parseISO(entry.date);
        
        if (!lastDate || differenceInDays(entryDate, lastDate) === 1) {
          tempStreak++;
          longest = Math.max(longest, tempStreak);
        } else {
          tempStreak = 1;
        }
        
        lastDate = entryDate;
      });

      return {
        habitId: habit.id,
        current: currentStreak,
        longest: Math.max(longest, currentStreak),
        lastCompletedDate: habitEntries[0]?.date
      };
    });

    setStreaks(newStreaks);
  };

  const getHabitEntry = (habitId: string, date: string) => {
    return entries.find(entry => entry.habitId === habitId && entry.date === date);
  };

  const getHabitStreak = (habitId: string) => {
    return streaks.find(streak => streak.habitId === habitId) || {
      habitId,
      current: 0,
      longest: 0
    };
  };

  return {
    habits,
    entries,
    streaks,
    addHabit,
    updateHabit,
    deleteHabit,
    toggleHabitCompletion,
    getHabitEntry,
    getHabitStreak,
  };
};