const DependenciesController = require('./dependencies.controller');
const Logger = require('../../logger');

module.exports = class DependenciesRoutes {
  static init(router) {
    Logger.info('Initialize dependencies routes');
    router.get('/api/dependencies', DependenciesController.getDependencies);
  }
};
