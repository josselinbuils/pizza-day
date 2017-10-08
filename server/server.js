'use strict';

const express = require('express');

const Auth = require('./auth/auth');
const config = require('./config');
const constants = require('./constants');
const DB = require('./db');
const Logger = require('./logger');
const PizzaDayService = require('./pizzaday');
const Routes = require('./routes');

const app = express();
const port = process.env.PORT || config.port || constants.DEFAULT_PORT;
const env = process.env.NODE_ENV || 'development';

if (env === 'development') {
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });
}

Logger.info(`Start PizzaDay in ${env} mode`);

Auth.init(app);
DB.init();
Routes.init(app);
PizzaDayService.schedule();
app.listen(port);

Logger.info('PizzaDay is listening on port ' + port);
