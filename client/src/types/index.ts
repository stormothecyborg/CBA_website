export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Habit {
  id: string;
  userId: string;
  name: string;
  description: string;
  emoji: string;
  frequency: 'daily' | 'weekly' | 'custom';
  customDays?: number[]; // 0-6 for Sunday-Saturday
  reminderTime?: string;
  createdAt: Date;
}

export interface HabitEntry {
  id: string;
  habitId: string;
  date: string; // YYYY-MM-DD format
  completed: boolean;
  note?: string;
  completedAt?: Date;
}

export interface HabitStreak {
  habitId: string;
  current: number;
  longest: number;
  lastCompletedDate?: string;
}