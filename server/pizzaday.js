'use strict';

const fs = require('fs');
const CronJob = require('cron').CronJob;
const os = require('os');

const constants = require('./constants');
const Logger = require('./logger');
const MailService = require('./mail');
const Order = require('./api/order/order.model');
const PizzaDay = require('./api/pizza-day/pizza-day.model');
const User = require('./api/user/user.model');

let _schedules = [];

module.exports = class PizzaDayService {

    static reschedule() {
        Logger.info('Reschedule pizza days');
        _unschedule();
        PizzaDayService.schedule();
    }

    static schedule() {
        Logger.info('Schedule pizza days');

        PizzaDay.getAll()
            .then(pizzaDays => {
                pizzaDays.forEach(pizzaDay => {

                    // Temporary code
                    // MailService.send('josselin.buils@gmail.com', 'Test!', 'welcome', {
                    //     pizzaDay: pizzaDay,
                    //     user: {_id: 'dsjhfihdsfhsd', firstName: 'Josselin'}
                    // });
                    // End temporary code

                    Logger.info('Schedule pizza day ' + pizzaDay._id + ' on week day ' + pizzaDay.day);

                    let reminderTime = pizzaDay.reminderTime.split(':');

                    _schedules.push(new CronJob({
                        cronTime: '00 ' + reminderTime[1] + ' ' + reminderTime[0] + ' * * ' + pizzaDay.day,
                        onTick: () => _startOrder(pizzaDay),
                        start: true,
                        timeZone: constants.TIMEZONE
                    }));
                });
            })
            .catch(error => Logger.error(error.stack));
    }
};

function _startOrder(pizzaDay) {
    Logger.info('Create order for pizza day ' + pizzaDay._id);

    Order
        .create({pizzaDay: pizzaDay._id})
        .then(order => {
            Logger.info('Order ' + order._id + ' created for pizza day ' + pizzaDay._id);
            Logger.info('Remind pizza day ' + pizzaDay._id + ' to participants');

            pizzaDay.participants.forEach(userId => {
                User.get(userId)
                    .then(user => MailService.send(user.email, 'Today is pizza day!', 'reminder', {
                        pizzaDay: pizzaDay,
                        orderId: order._id,
                        user: user
                    }))
                    .catch(error => Logger.error(error.stack));
            });
        })
        .catch(error => Logger.error(error.stack));
}

function _unschedule() {
    Logger.info('Unschedule pizza days');

    _schedules.forEach(schedule => schedule.stop());
    _schedules = [];
}