const constants = require('../../constants');
const PizzaDay = require('./pizza-day.model');
const PizzaDayService = require('../../pizzaday');
const Pizzeria = require('../pizzeria/pizzeria.model');
const User = require('../user/user.model');

module.exports = class PizzaDayController {

  static createPizzaDay(req, res, next) {
    let newPizzaDay = req.body;
    let reqUser = req.user;

    if (newPizzaDay.owner !== String(reqUser._id) && !reqUser.isAdmin()) {
      return res.status(constants.HTTP_FORBIDDEN).json({error: 'You have not the rights to create a pizza day for someone else'});
    }

    PizzaDay
      .create(req.body)
      .then(pizzaDay => {
        PizzaDayService.reschedule();
        res.status(constants.HTTP_CREATED).json(pizzaDay)
      })
      .catch(error => next(new Error(error)));
  }

  static deletePizzaDay(req, res, next) {

    let id = req.params.id,
      reqUser = req.user;

    PizzaDay
      .doesExist(id)
      .then(exists => {

        if (!exists) {
          return res.status(constants.HTTP_NOT_FOUND).json({error: 'Unknown pizza day'});
        }

        PizzaDay
          .get(id)
          .then(pizzaDay => {

            if (pizzaDay.owner !== String(reqUser._id) && !reqUser.isAdmin()) {
              return res.status(constants.HTTP_FORBIDDEN).json({error: 'You have not the rights to delete a pizza day which is not yours'});
            }

            PizzaDay
              .delete(id)
              .then(() => {
                PizzaDayService.reschedule();
                res.status(constants.HTTP_OK).end()
              })
              .catch(error => next(new Error(error)));

          })
          .catch(error => next(new Error(error)));
      })
      .catch(error => next(new Error(error)));
  }

  static editPizzaDay(req, res, next) {

    let id = req.params.id;
    let reqUser = req.user;

    PizzaDay
      .doesExist(id)
      .then(exists => {

        if (!exists) {
          return res.status(constants.HTTP_NOT_FOUND).json({error: 'Unknown pizza day'});
        }

        PizzaDay
          .get(id)
          .then(pizzaDay => {

            if (pizzaDay.owner !== String(reqUser._id) && !reqUser.isAdmin()) {
              return res.status(constants.HTTP_FORBIDDEN).json({error: 'You have not the rights to edit a pizza day which is not yours'});
            }

            PizzaDay
              .edit(id, req.body)
              .then(pizzaDay => {
                PizzaDayService.reschedule();
                res.status(constants.HTTP_OK).json(pizzaDay)
              })
              .catch(error => next(new Error(error)));
          })
          .catch(error => next(new Error(error)));
      })
      .catch(error => next(new Error(error)));
  }

  static getPizzaDay(req, res, next) {

    let id = req.params.id;

    PizzaDay
      .doesExist(id)
      .then(exists => {

        if (!exists) {
          return res.status(constants.HTTP_NOT_FOUND).json({error: 'Unknown pizza day'});
        }

        PizzaDay
          .get(id)
          .then(pizzaDay => {

            _formatPizzaDay(pizzaDay)
              .then(formattedPizzaDay => res.status(constants.HTTP_OK).json(formattedPizzaDay))
              .catch(error => next(new Error(error)));

          })
          .catch(error => next(new Error(error)));

      })
      .catch(error => next(new Error(error)));
  }

  static getPizzaDays(req, res, next) {
    PizzaDay
      .getAll()
      .then(pizzaDays => {

        let formattedPizzaDays = [],
          promises = [];

        pizzaDays
          .filter(pizzaDay => pizzaDay.participants.indexOf(req.user._id) !== -1 || pizzaDay.owner === req.user._id || req.user.isAdmin())
          .forEach(pizzaDay => promises.push(
            _formatPizzaDay(pizzaDay)
              .then(formattedPizzaDay => formattedPizzaDays.push(formattedPizzaDay))
              .catch(error => next(new Error(error)))
          ));

        Promise.all(promises)
          .then(() => res.status(constants.HTTP_OK).json(formattedPizzaDays))
          .catch(error => next(new Error(error)));
      })
      .catch(error => next(new Error(error)));
  }
};

function _formatPizzaDay(pizzaDay) {

  let formattedPizzaDay = {};
  let promises = [];

  formattedPizzaDay._id = pizzaDay._id;
  formattedPizzaDay.createdAt = pizzaDay.createdAt;
  formattedPizzaDay.day = pizzaDay.day;
  formattedPizzaDay.mealTime = pizzaDay.mealTime;
  formattedPizzaDay.orderTime = pizzaDay.orderTime;
  formattedPizzaDay.purchaseTime = pizzaDay.purchaseTime;
  formattedPizzaDay.reminderTime = pizzaDay.reminderTime;

  promises.push(
    Pizzeria.get(pizzaDay.pizzeria)
      .then(pizzeria => formattedPizzaDay.pizzeria = pizzeria ? pizzeria : {
        address: '',
        name: 'Unknown pizzeria',
        phone: '',
        pizzas: []
      })
  );

  promises.push(
    User.get(pizzaDay.owner)
      .then(user => formattedPizzaDay.owner = user ? user.getLight() : {
        _id: ' ',
        admin: false,
        email: ' ',
        firstName: 'Unknown user',
        lastName: ' '
      })
  );

  let participants = [];

  pizzaDay.participants.forEach(userId => {
    promises.push(
      User.get(userId)
        .then(user => participants.push(user ? user.getLight() : {
          _id: ' ',
          admin: false,
          email: ' ',
          firstName: 'Unknown user',
          lastName: ' '
        }))
    );
  });

  return Promise.all(promises)
    .then(() => {
      formattedPizzaDay.participants = participants.sort((a, b) => a.lastName < b.lastName ? -1 : (a.lastName > b.lastName ? 1 : 0))
      return formattedPizzaDay;
    });
}
