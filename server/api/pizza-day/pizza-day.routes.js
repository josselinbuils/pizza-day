const Auth = require('../../auth/auth');
const Logger = require('../../logger');
const PizzaDayController = require('./pizza-day.controller');

module.exports = class PizzaDayRoutes {
  static init(router) {
    Logger.info('Initialize pizza day routes');

    router.post('/api/pizzaDay', Auth.isAuthenticated, Auth.isAdmin, PizzaDayController.createPizzaDay);
    router.get('/api/pizzaDay/:id', Auth.isAuthenticated, PizzaDayController.getPizzaDay);
    router.patch('/api/pizzaDay/:id', Auth.isAuthenticated, PizzaDayController.editPizzaDay);
    router.delete('/api/pizzaDay/:id', Auth.isAuthenticated, PizzaDayController.deletePizzaDay);
    router.get('/api/pizzaDays', Auth.isAuthenticated, PizzaDayController.getPizzaDays);
  }
};
