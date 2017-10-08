const mongoose = require('mongoose');

const LocalDate = require('../../localdate');
const OrderSchema = require('./order.shema');

OrderSchema.methods.isOutdated = function () {
  // TODO make the check with order time
  return this.createdAt.toDateString() !== new Date(LocalDate.now()).toDateString();
};

OrderSchema.statics.create = order => new Promise((resolve, reject) => {
  new Order(order).save((error, saved) => {
    error ? reject(error.message) : resolve(saved);
  });
});

OrderSchema.statics.get = id => new Promise((resolve, reject) => {
  Order.findById(id, (error, order) => {
    error ? reject(error.message) : resolve(order);
  });
});

OrderSchema.statics.saveChoice = (orderId, userId, choice) => new Promise((resolve, reject) => {
  Order.findById(orderId, (error, order) => {

    if (error) {
      reject(error.message)
    }

    choice.user = userId;
    order.choices.push(choice);

    order.save((error, saved) => {
      error ? reject(error.message) : resolve(saved);
    });
  });
});

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;
