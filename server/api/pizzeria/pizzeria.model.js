const mongoose = require('mongoose');

const PizzeriaSchema = require('./pizzeria.shema');

PizzeriaSchema.pre('save', function (next) {
  let pizzeria = this;

  pizzeria.name = pizzeria.name.toLowerCase().replace(/(^|\s)./g, function (c) {
    return c.toUpperCase();
  });

  pizzeria.pizzas.forEach(pizza => {

    pizza.name = pizza.name.toLowerCase().replace(/(^|\s)./g, function (c) {
      return c.toUpperCase();
    });

    pizza.description = pizza.description.toLowerCase().replace(/(^|\s)./g, function (c) {
      return c.toUpperCase();
    });
  });

  pizzeria.pizzas = pizzeria.pizzas.sort((a, b) => a.name < b.name ? -1 : (a.name > b.name ? 1 : 0))

  next();
});

PizzeriaSchema.statics.create = pizzeria => new Promise((resolve, reject) => {
  new Pizzeria(pizzeria).save((error, saved) => {
    error ? reject(error.message) : resolve(saved);
  });
});

PizzeriaSchema.statics.delete = id => new Promise((resolve, reject) => {
  Pizzeria.findByIdAndRemove(id, error => {
    error ? reject(error.message) : resolve();
  });
});

PizzeriaSchema.statics.doesExist = id => new Promise((resolve, reject) => {
  Pizzeria.count({_id: id}, (error, count) => {
    error ? reject(error.message) : resolve(count > 0);
  });
});

PizzeriaSchema.statics.edit = (id, updatedFields) => new Promise((resolve, reject) => {
  Pizzeria.findById(id, (error, pizzeria) => {

    if (error) {
      reject(error.message)
    }

    for (let key in updatedFields) {
      if (updatedFields.hasOwnProperty(key)) {
        pizzeria[key] = updatedFields[key];
      }
    }

    pizzeria.save((error, saved) => {
      error ? reject(error.message) : resolve(saved);
    });
  });
});

PizzeriaSchema.statics.get = id => new Promise((resolve, reject) => {
  Pizzeria.findById(id, (error, pizzeria) => {
    error ? reject(error.message) : resolve(pizzeria);
  });
});

PizzeriaSchema.statics.getAll = () => new Promise((resolve, reject) => {
  Pizzeria.find({}, (error, pizzerias) => {
    error ? reject(error.message) : resolve(pizzerias);
  });
});

const Pizzeria = mongoose.model('Pizzeria', PizzeriaSchema);

module.exports = Pizzeria;
