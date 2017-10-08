const mongoose = require('mongoose');

const ChoiceSchema = require('./choice.schema');
const LocalDate = require('../../localdate');

module.exports = mongoose.Schema({
  choices: {
    type: [ChoiceSchema],
    default: []
  },
  createdAt: {
    type: Date,
    default: LocalDate.now
  },
  endDate: {
    type: Date
  },
  pizzaDay: {
    type: String,
    required: true
  }
});
