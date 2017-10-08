const Auth = require('../../auth/auth');
const Logger = require('../../logger');
const OrderController = require('./order.controller');

module.exports = class OrderRoutes {
  static init(router) {
    Logger.info('Initialize order routes');

    router.get('/api/order/:id', OrderController.getChoices);
    router.post('/api/order/:id', Auth.isAuthenticated, OrderController.orderPizza);
  }
};
