const constants = require('../../constants');
const Pizzeria = require('./pizzeria.model');

module.exports = class PizzeriaController {

  static createPizzeria(req, res) {
    Pizzeria
      .create(req.body)
      .then(pizzeria => res.status(constants.HTTP_CREATED).json(pizzeria))
      .catch(error => next(new Error(error)));
  }

  static deletePizzeria(req, res) {

    let id = req.params.id;

    Pizzeria
      .doesExist(id)
      .then(exists => {

        if (!exists) {
          return res.status(constants.HTTP_NOT_FOUND).json({error: 'Unknown pizzeria'});
        }

        Pizzeria.delete(id)
          .then(() => res.status(constants.HTTP_OK).end())
          .catch(error => next(new Error(error)));
      })
      .catch(error => next(new Error(error)));
  }

  static editPizzeria(req, res) {

    let id = req.params.id;

    Pizzeria
      .doesExist(id)
      .then(exists => {

        if (!exists) {
          return res.status(constants.HTTP_NOT_FOUND).json({error: 'Unknown pizzeria'});
        }

        Pizzeria.edit(id, req.body)
          .then(pizzeria => res.status(constants.HTTP_OK).json(pizzeria))
          .catch(error => next(new Error(error)));
      })
      .catch(error => next(new Error(error)));
  }

  static getPizzeria(req, res) {

    let id = req.params.id;

    Pizzeria
      .doesExist(id)
      .then(exists => {

        if (!exists) {
          return res.status(constants.HTTP_NOT_FOUND).json({error: 'Unknown pizzeria'});
        }

        Pizzeria.get(id)
          .then(pizzeria => res.status(constants.HTTP_OK).json(pizzeria))
          .catch(error => next(new Error(error)));
      })
      .catch(error => next(new Error(error)));
  }

  static getPizzerias(req, res) {
    Pizzeria
      .getAll()
      .then(pizzerias => res.status(constants.HTTP_OK).json(pizzerias))
      .catch(error => next(new Error(error)));
  }
};
