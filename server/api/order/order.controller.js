const constants = require('../../constants');
const Logger = require('../../logger');
const Order = require('./order.model');
const Pizza = require('../pizzeria/pizza.model');
const User = require('../user/user.model');

module.exports = class OrderController {

  static getChoices(req, res) {
    Order
      .get(req.params.id)
      .then(order => {

        let formattedChoices = [],
          promises = [];

        order.choices.forEach(choice => promises.push(
          _formatChoice(choice)
            .then(formattedChoice => formattedChoices.push(formattedChoice))
            .catch(error => next(new Error(error)))
        ));

        Promise.all(promises)
          .then(() => res.status(constants.HTTP_OK).json(formattedChoices))
          .catch(error => next(new Error(error)));
      })
      .catch(error => next(new Error(error)));
  }

  static orderPizza(req, res) {

    let id = req.params.id,
      choice = req.body,
      userId = req.user._id;

    Order
      .saveChoice(id, userId, choice)
      .then(() => res.status(constants.HTTP_OK).end())
      .catch(error => next(new Error(error)));
  }
};

function _formatChoice(choice) {

  let formattedChoice = {},
    promises = [];

  formattedChoice.notes = choice.notes;
  formattedChoice.pizza = choice.pizza;

  // promises.push(
  //     Pizza.get(choice.pizza)
  //         .then(pizza => {
  //             console.log(pizza);
  //             formattedChoice.pizza = pizza;
  //         })
  //         .catch(error => Logger.error(error))
  // );

  promises.push(
    User.get(choice.user)
      .then(user => formattedChoice.user = user ? user.firstName : {firstName: 'Unknown user'})
      .catch(error => Logger.error(error))
  );

  return Promise.all(promises).then(() => formattedChoice);
}
