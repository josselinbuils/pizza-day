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

Logger.info(`Start PizzaDay in ${env} mode`);

Auth.init(app);
DB.init();
Routes.init(app, env);
PizzaDayService.schedule();
app.listen(port);

Logger.info('PizzaDay is listening on port ' + port);