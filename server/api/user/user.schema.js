const mongoose = require('mongoose');

const LocalDate = require('../../localdate');

module.exports = mongoose.Schema({
  admin: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: LocalDate.now
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  }
});
