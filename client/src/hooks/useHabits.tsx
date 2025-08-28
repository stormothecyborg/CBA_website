import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { format, parseISO, differenceInDays } from 'date-fns';

// These types are based on your backend schema and old frontend code
interface Habit {
  _id: string;
  name: string;
  completionDates: { date: string, note?: string }[];
  currentStreak: number;
  longestStreak: number;
  description?: string;
  emoji?: string;
  frequency?: string;
  customDays?: number[];
  reminderTime?: string;
}

interface HabitEntry {
  id: string;
  habitId: string;
  date: string;
  completed: boolean;
  note?: string;
}

interface HabitStreak {
  habitId: string;
  current: number;
  longest: number;
}

export const useHabits = () => {
  const { user } = useAuth();
  // We explicitly set the type here to resolve the `never[]` error
  const [habits, setHabits] = useState<Habit[]>([]);
  const [entries, setEntries] = useState<HabitEntry[]>([]);
  const [streaks, setStreaks] = useState<HabitStreak[]>([]);
  const [loading, setLoading] = useState(true);

  // This effect fetches all habits from the backend on user change
  useEffect(() => {
    if (user) {
      const fetchHabits = async () => {
        try {
          const res = await axios.get('http://localhost:5000/api/habits');
          setHabits(res.data);
        } catch (error) {
          console.error('Error fetching habits:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchHabits();
    }
  }, [user]);

  // This effect populates entries and streaks based on the habits fetched from the backend
  useEffect(() => {
    if (habits.length > 0) {
      // Recreate the entries state from the new backend data
      const allEntries = habits.flatMap(habit =>
        habit.completionDates.map(completion => ({
          id: `${habit._id}-${completion.date}`,
          habitId: habit._id,
          date: format(parseISO(completion.date), 'yyyy-MM-dd'),
          completed: true,
          note: completion.note
        }))
      );
      setEntries(allEntries);

      // Recreate the streaks state from the new backend data
      const newStreaks = habits.map(habit => ({
        habitId: habit._id,
        current: habit.currentStreak,
        longest: habit.longestStreak,
      }));
      setStreaks(newStreaks);
    }
  }, [habits]);

  const addHabit = async (habitData: any) => {
    if (!user) return;
    try {
      const res = await axios.post('http://localhost:5000/api/habits', habitData);
      // Update state with the new habit returned from the backend
      setHabits(prevHabits => [...prevHabits, res.data]);
    } catch (error) {
      console.error('Error adding habit:', error);
    }
  };

  const updateHabit = async (habitId: string, habitData: any) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/habits/${habitId}`, habitData);
      // Replace the old habit with the updated one
      setHabits(prevHabits => prevHabits.map(h => (h._id === habitId ? res.data : h)));
    } catch (error) {
      console.error('Error updating habit:', error);
    }
  };

  const deleteHabit = async (habitId: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/habits/${habitId}`);
      // Remove the deleted habit from the state
      setHabits(prevHabits => prevHabits.filter(h => h._id !== habitId));
    } catch (error) {
      console.error('Error deleting habit:', error);
    }
  };

  const toggleHabitCompletion = async (habitId: string, date: string, note?: string) => {
    try {
      // The backend handles the streak and entry logic
      const res = await axios.post(`http://localhost:5000/api/habits/${habitId}/complete`, { date, note });
      // Update the habit in the state with the new data from the backend
      setHabits(prevHabits => prevHabits.map(h => (h._id === habitId ? res.data : h)));
    } catch (error) {
      console.error('Error toggling habit completion:', error);
    }
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
    loading
  };
};