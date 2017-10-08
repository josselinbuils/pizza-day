const mongoose = require('mongoose');

const LocalDate = require('../../localdate');

module.exports = mongoose.Schema({
  createdAt: {
    type: Date,
    default: LocalDate.now
  },
  notes: {
    type: String
  },
  pizza: {
    type: String,
    required: true
  },
  user: {
    type: String,
    required: true
  }
});
