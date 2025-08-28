const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: false,
  },
  googleId: { // New field added
    type: String,
    unique: true,
    sparse: true, // Allows null values to be unique
  },
});

module.exports = mongoose.model('User', userSchema);