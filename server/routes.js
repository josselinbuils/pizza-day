const bodyParser = require('body-parser');
const contentLength = require('express-content-length-validator');
const express = require('express');
const helmet = require('helmet');
const serveStatic = require('serve-static');

const AuthRoutes = require('./auth/auth.routes');
const constants = require('./constants.json');
const DependenciesRoutes = require('./api/dependencies/dependencies.routes');
const Logger = require('./logger');
const OrderRoutes = require('./api/order/order.routes');
const PizzaDayRoutes = require('./api/pizza-day/pizza-day.routes');
const PizzeriaRoutes = require('./api/pizzeria/pizzeria.routes');
const UserRoutes = require('./api/user/user.routes');

module.exports = class Routes {
  static init(app) {
    Logger.info('Initialize routes');

    const router = express.Router();
    const root = process.cwd();
    const clientPath = root + '/dist';

    Logger.info('Configure router middlewares');

    app.use((req, res, next) => {
      Logger.info(req.method + ' ' + req.url);
      next();
    });

    app.use(helmet());
    app.use(process.env.HTTP_PREFIX || '/', serveStatic(clientPath));
    app.use(contentLength.validateMax({max: 9999}));
    app.use(bodyParser.json());

    AuthRoutes.init(router);
    DependenciesRoutes.init(router);
    OrderRoutes.init(router);
    PizzaDayRoutes.init(router);
    PizzeriaRoutes.init(router);
    UserRoutes.init(router);

    router.get('*', (req, res) => {
      res.sendFile(clientPath + '/index.html');
    });

    // next is required even if not used
    router.use((error, req, res, next) => {
      Logger.error(error.stack);
      res.status(constants.HTTP_INTERNAL_ERROR).json({error: 'An error occurred :('});
    });

    app.use('/', router);
  }
};
