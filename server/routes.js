'use strict';

const bodyParser = require('body-parser');
const contentLength = require('express-content-length-validator');
const express = require('express');
const helmet = require('helmet');

const AuthRoutes = require('./auth/auth.routes');
const constants = require('./constants.json');
const DependenciesRoutes = require('./api/dependencies/dependencies.routes');
const Logger = require('./logger');
const OrderRoutes = require('./api/order/order.routes');
const PizzaDayRoutes = require('./api/pizza-day/pizza-day.routes');
const PizzeriaRoutes = require('./api/pizzeria/pizzeria.routes');
const UserRoutes = require('./api/user/user.routes');

module.exports = class Routes {
  static init(app, env) {
    Logger.info('Initialize routes');

    let router = express.Router(),
      root = process.cwd(),
      clientPath = root + '/dist/' + (env === 'production' ? 'prod' : 'dev');

    Logger.info('Configure router middlewares');

    app.use((req, res, next) => {
      Logger.info(req.method + ' ' + req.url);
      next();
    });

    app.use(helmet());

    if (env === 'development') {
      app.use('/node_modules', express.static(root + '/node_modules'));
      app.use('/dist/dev', express.static(root + '/dist/dev'));
    }

    app.use(express.static(clientPath));
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
