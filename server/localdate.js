'use strict';

var moment = require('moment-timezone');

const constants = require('./constants');

module.exports = class LocalDate {
    static now() {
        return moment().tz(constants.TIMEZONE).format();
    }
};