const constants = require('../../constants');
const dependencies = require('../../../package').dependencies;

module.exports = class DependenciesController {
  static getDependencies(req, res) {
    res.status(constants.HTTP_OK).json(Object.keys(dependencies));
  }
};
