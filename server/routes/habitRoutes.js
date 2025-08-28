const express = require('express');
const Habit = require('../models/Habit');
const auth = require('../middleware/auth');

const router = express.Router();

// Streak Calculation Helper Function
// This function calculates both current and longest streaks.
const calculateStreak = (completionDates) => {
    if (completionDates.length === 0) return { current: 0, longest: 0 };

    const sortedDates = completionDates.map(d => new Date(d)).sort((a, b) => a.getTime() - b.getTime());

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    let lastDate = null;

    sortedDates.forEach(date => {
        date.setHours(0, 0, 0, 0);
        if (!lastDate) {
            tempStreak = 1;
        } else {
            const diffDays = Math.round((date.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
            if (diffDays === 1) {
                tempStreak++;
            } else if (diffDays > 1) {
                longestStreak = Math.max(longestStreak, tempStreak);
                tempStreak = 1;
            }
        }
        lastDate = date;
    });

    longestStreak = Math.max(longestStreak, tempStreak);

    tempStreak = 0;
    lastDate = null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const completedDatesWithToday = [...sortedDates];
    if (completedDatesWithToday.length > 0 && completedDatesWithToday[completedDatesWithToday.length - 1].getTime() < today.getTime()) {
      completedDatesWithToday.push(today);
    }
    
    for (let i = completedDatesWithToday.length - 1; i >= 0; i--) {
        const date = completedDatesWithToday[i];
        if (!lastDate) {
            tempStreak = 1;
        } else {
            const diffDays = Math.round((lastDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
            if (diffDays === 1) {
                tempStreak++;
            } else {
                break;
            }
        }
        lastDate = date;
    }
    currentStreak = tempStreak;

    return { current: currentStreak, longest: longestStreak };
};

// Protect all routes in this file with the 'auth' middleware
router.use(auth);

// @route   GET /api/habits
// @desc    Get all habits for the authenticated user
// @access  Private
router.get('/', async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(habits);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/habits
// @desc    Create a new habit
// @access  Private
router.post('/', async (req, res) => {
  const { name, description, emoji, frequency, customDays, reminderTime } = req.body;
  try {
    const newHabit = new Habit({
      user: req.user.id,
      name, description, emoji, frequency, customDays, reminderTime
    });
    const habit = await newHabit.save();
    res.json(habit);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/habits/:id
// @desc    Update a habit
// @access  Private
router.put('/:id', async (req, res) => {
  const { name, description, emoji, frequency, customDays, reminderTime } = req.body;
  const habitFields = { name, description, emoji, frequency, customDays, reminderTime };
  try {
    let habit = await Habit.findById(req.params.id);
    if (!habit) return res.status(404).json({ msg: 'Habit not found' });
    if (habit.user.toString() !== req.user.id) return res.status(401).json({ msg: 'User not authorized' });
    habit = await Habit.findByIdAndUpdate(req.params.id, { $set: habitFields }, { new: true });
    res.json(habit);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/habits/:id
// @desc    Delete a habit
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    let habit = await Habit.findById(req.params.id);
    if (!habit) return res.status(404).json({ msg: 'Habit not found' });
    if (habit.user.toString() !== req.user.id) return res.status(401).json({ msg: 'User not authorized' });
    await Habit.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Habit removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/habits/:id/complete
// @desc    Log a habit completion and update streak
// @access  Private
router.post('/:id/complete', async (req, res) => {
  const { note } = req.body;
  try {
    let habit = await Habit.findById(req.params.id);
    if (!habit) return res.status(404).json({ msg: 'Habit not found' });
    if (habit.user.toString() !== req.user.id) return res.status(401).json({ msg: 'User not authorized' });
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const completionDatesArray = habit.completionDates.map(entry => new Date(entry.date));
    const alreadyCompletedIndex = completionDatesArray.findIndex(date => date.getTime() === today.getTime());

    if (alreadyCompletedIndex !== -1) {
      habit.completionDates.splice(alreadyCompletedIndex, 1);
    } else {
      habit.completionDates.push({ date: new Date(), note: note || '' });
    }

    const updatedCompletionDates = habit.completionDates.map(entry => entry.date);
    const { current, longest } = calculateStreak(updatedCompletionDates);

    habit.currentStreak = current;
    habit.longestStreak = Math.max(habit.longestStreak, longest);

    await habit.save();
    res.json(habit);
    
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;