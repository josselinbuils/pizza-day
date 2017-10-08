'use strict';

const mongoose = require('mongoose');

const Logger = require('./logger');

module.exports = class DB {
    static init() {
        Logger.info('Initialize database');
        mongoose.connect('mongodb://josselinbuils.me:27017/pizza-day');
        mongoose.connection.on('error', error => Logger.error('An error occurred with the DB connection: ' + error.stack));
    }
};
