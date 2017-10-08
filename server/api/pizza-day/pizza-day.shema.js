const mongoose = require('mongoose');

const LocalDate = require('../../localdate');

module.exports = mongoose.Schema({
  createdAt: {
    type: Date,
    default: LocalDate.now
  },
  day: {
    type: Number,
    required: true
  },
  mealTime: {
    type: String,
    required: true
  },
  orderTime: {
    type: String,
    required: true
  },
  owner: {
    type: String,
    required: true
  },
  participants: {
    type: [String],
    default: []
  },
  pizzeria: {
    type: String,
    required: true
  },
  purchaseTime: {
    type: String,
    required: true
  },
  reminderTime: {
    type: String,
    required: true
  }
});
