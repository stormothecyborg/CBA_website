const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  completionDates: [
    {
      date: { type: Date, required: true },
      note: { type: String, required: false },
    }
  ],
  currentStreak: {
    type: Number,
    default: 0,
  },
  longestStreak: {
    type: Number,
    default: 0,
  },
  description: { type: String, required: false },
  emoji: { type: String, required: false },
  frequency: { type: String, required: false, enum: ['daily', 'weekly', 'custom'] },
  customDays: { type: [Number], required: false },
  reminderTime: { type: String, required: false },
}, { timestamps: true });

module.exports = mongoose.model('Habit', habitSchema);