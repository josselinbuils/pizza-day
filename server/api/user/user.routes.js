const Auth = require('../../auth/auth');
const Logger = require('../../logger');
const UserController = require('./user.controller');

module.exports = class UserRoutes {
  static init(router) {
    Logger.info('Initialize user routes');

    router.post('/api/user', UserController.createUser);
    router.get('/api/user/:id', Auth.isAuthenticated, UserController.getUser);
    router.patch('/api/user/:id', Auth.isAuthenticated, UserController.editUser);
    router.delete('/api/user/:id', Auth.isAuthenticated, UserController.deleteUser);
    router.get('/api/users', Auth.isAuthenticated, UserController.getUsers);
  }
};
