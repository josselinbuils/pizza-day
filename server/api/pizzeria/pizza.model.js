const mongoose = require('mongoose');

const PizzaSchema = require('./pizza.shema');

PizzaSchema.statics.get = id => new Promise((resolve, reject) => {
  Pizza.findById(id, (error, pizza) => {
    error ? reject(error.message) : resolve(pizza);
  });
});

const Pizza = mongoose.model('Pizza', PizzaSchema);

module.exports = Pizza;
