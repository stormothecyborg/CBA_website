const express = require('express');
const Habit = require('../models/Habit');
const auth = require('../middleware/auth'); // We will create this middleware

const router = express.Router();

// Streak Calculation Helper Function
const calculateStreak = (completionDates) => {
  if (completionDates.length === 0) return { current: 0, longest: 0 };

  let currentStreak = 0;
  let longestStreak = 0;
  let today = new Date();
  today.setHours(0, 0, 0, 0);

  // Sort dates in descending order
  const sortedDates = [...completionDates].sort((a, b) => b - a);

  // Check for today's completion
  const lastCompletion = new Date(sortedDates[0]);
  lastCompletion.setHours(0, 0, 0, 0);
  let isCompletedToday = false;
  if (lastCompletion.getTime() === today.getTime()) {
    isCompletedToday = true;
    currentStreak = 1;
  }

  // Calculate streak backwards from yesterday
  for (let i = 0; i < sortedDates.length - 1; i++) {
    const date1 = new Date(sortedDates[i]);
    const date2 = new Date(sortedDates[i+1]);
    
    date1.setHours(0, 0, 0, 0);
    date2.setHours(0, 0, 0, 0);

    const diffTime = Math.abs(date1 - date2);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      currentStreak++;
    } else {
      break;
    }
  }

  // A simple way to track longest streak (can be optimized)
  // This logic should be expanded to be more robust.
  longestStreak = Math.max(longestStreak, currentStreak);

  return { current: currentStreak, longest: longestStreak };
};

// @route   POST /api/habits
// @desc    Create a new habit
// @access  Private
router.post('/', auth, async (req, res) => {
  const { name } = req.body;

  try {
    const newHabit = new Habit({
      user: req.user.id,
      name,
    });

    const habit = await newHabit.save();
    res.json(habit);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/habits
// @desc    Get all habits for the authenticated user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(habits);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/habits/:id
// @desc    Update a habit
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const { name } = req.body;

  try {
    let habit = await Habit.findById(req.params.id);

    if (!habit) {
      return res.status(404).json({ msg: 'Habit not found' });
    }

    // Ensure user owns the habit
    if (habit.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    habit = await Habit.findByIdAndUpdate(
      req.params.id,
      { $set: { name } },
      { new: true }
    );

    res.json(habit);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/habits/:id
// @desc    Delete a habit
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    let habit = await Habit.findById(req.params.id);

    if (!habit) {
      return res.status(404).json({ msg: 'Habit not found' });
    }

    // Ensure user owns the habit
    if (habit.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

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
router.post('/:id/complete', auth, async (req, res) => {
  try {
    let habit = await Habit.findById(req.params.id);

    if (!habit) {
      return res.status(404).json({ msg: 'Habit not found' });
    }

    if (habit.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if the habit was already completed today
    const alreadyCompletedToday = habit.completionDates.some(date => {
      const completionDate = new Date(date);
      completionDate.setHours(0, 0, 0, 0);
      return completionDate.getTime() === today.getTime();
    });

    if (alreadyCompletedToday) {
      return res.status(400).json({ msg: 'Habit already completed today' });
    }

    // Add today's date to completions
    habit.completionDates.push(new Date());

    // Recalculate streak
    const { current, longest } = calculateStreak(habit.completionDates);
    habit.currentStreak = current;
    if (current > habit.longestStreak) {
      habit.longestStreak = current;
    }

    await habit.save();
    res.json(habit);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


module.exports = router;