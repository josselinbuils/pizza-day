const mongoose = require('mongoose');

const PizzaDaySchema = require('./pizza-day.shema');

PizzaDaySchema.statics.create = pizzaDay => new Promise((resolve, reject) => {
  new PizzaDay(pizzaDay).save((error, saved) => {
    error ? reject(error.message) : resolve(saved);
  });
});

PizzaDaySchema.statics.delete = id => new Promise((resolve, reject) => {
  PizzaDay.findByIdAndRemove(id, error => {
    error ? reject(error.message) : resolve();
  });
});

PizzaDaySchema.statics.doesExist = id => new Promise((resolve, reject) => {
  PizzaDay.count({_id: id}, (error, count) => {
    error ? reject(error.message) : resolve(count > 0);
  });
});

PizzaDaySchema.statics.edit = (id, updatedFields) => new Promise((resolve, reject) => {
  PizzaDay.findById(id, (error, pizzaDay) => {

    if (error) {
      reject(error.message)
    }

    for (let key in updatedFields) {
      if (updatedFields.hasOwnProperty(key)) {
        pizzaDay[key] = updatedFields[key];
      }
    }

    pizzaDay.save((error, saved) => {
      error ? reject(error.message) : resolve(saved);
    });
  });
});

PizzaDaySchema.statics.get = id => new Promise((resolve, reject) => {
  PizzaDay.findById(id, (error, pizzaDay) => {
    error ? reject(error.message) : resolve(pizzaDay);
  });
});

PizzaDaySchema.statics.getAll = () => new Promise((resolve, reject) => {
  PizzaDay.find({}, (error, pizzaDays) => {
    error ? reject(error.message) : resolve(pizzaDays);
  });
});

const PizzaDay = mongoose.model('PizzaDay', PizzaDaySchema);

module.exports = PizzaDay;
