const mongoose = require('mongoose');

const LocalDate = require('../../localdate');
const PizzaSchema = require('./pizza.shema');

module.exports = mongoose.Schema({
  createdAt: {
    type: Date,
    default: LocalDate.now
  },
  address: {
    type: String,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  pizzas: {
    type: [PizzaSchema]
  }
});
