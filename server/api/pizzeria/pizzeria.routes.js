const Auth = require('../../auth/auth');
const Logger = require('../../logger');
const PizzeriaController = require('./pizzeria.controller');

module.exports = class PizzeriaRoutes {
  static init(router) {
    Logger.info('Initialize pizzeria routes');

    router.post('/api/pizzeria', Auth.isAuthenticated, Auth.isAdmin, PizzeriaController.createPizzeria);
    router.get('/api/pizzeria/:id', Auth.isAuthenticated, PizzeriaController.getPizzeria);
    router.patch('/api/pizzeria/:id', Auth.isAuthenticated, Auth.isAdmin, PizzeriaController.editPizzeria);
    router.delete('/api/pizzeria/:id', Auth.isAuthenticated, Auth.isAdmin, PizzeriaController.deletePizzeria);
    router.get('/api/pizzerias', Auth.isAuthenticated, PizzeriaController.getPizzerias);
  }
};
