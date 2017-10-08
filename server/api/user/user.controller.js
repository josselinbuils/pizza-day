const constants = require('../../constants');
const MailService = require('../../mail');
const User = require('./user.model');

module.exports = class UserController {

  static createUser(req, res, next) {

    let newUser = req.body,
      reqUser = req.user;

    // Only admin users can create others admin users
    if (newUser.admin && !reqUser.isAdmin()) {
      return res.status(constants.HTTP_FORBIDDEN).json({error: 'In your dreams ;)'});
    }

    User.create(newUser)
      .then(user => {
        res.status(constants.HTTP_CREATED).json(user.getLight());
        newUser.hiddenPassword = newUser.password.slice(0, 1) + '*'.repeat(newUser.password.length - 2) + newUser.password.slice(-1);
        MailService.send(user.email, 'Welcome ' + user.firstName + '!', 'welcome', {user: newUser});
      })
      .catch(error => next(new Error(error)));
  }

  static deleteUser(req, res, next) {

    let id = req.params.id;

    User.doesExist(id)
      .then(exists => {

        let reqUser = req.user;

        if (!exists) {
          return res.status(constants.HTTP_NOT_FOUND).json({error: 'Unknown user'});
        }

        if (id !== String(reqUser._id) && !reqUser.isAdmin()) {
          return res.status(constants.HTTP_FORBIDDEN).json({error: 'You have not the rights to delete other users'});
        }

        User.delete(id)
          .then(() => res.status(constants.HTTP_OK).end())
          .catch(error => next(new Error(error)));
      })
      .catch(error => next(new Error(error)));
  }

  static editUser(req, res, next) {

    let id = req.params.id;

    User.doesExist(id)
      .then(exists => {

        let editedUser = req.body,
          reqUser = req.user;

        if (!exists) {
          return res.status(constants.HTTP_NOT_FOUND).json({error: 'Unknown user'});
        }

        if (!reqUser.isAdmin()) {

          // Only admin users can edit other users
          if (id !== String(reqUser._id)) {
            return res.status(constants.HTTP_FORBIDDEN).json({error: 'You have not the rights to edit other users'});
          }

          // Only admin users can make other user admin
          if (editedUser.admin) {
            return res.status(constants.HTTP_FORBIDDEN).json({error: 'In your dreams ;)'});
          }
        }

        if (editedUser.email && editedUser.email !== reqUser.email) {
          return res.status(constants.HTTP_FORBIDDEN).json({error: 'You cannot edit your email'});
        }

        User.edit(id, editedUser)
          .then(user => res.status(constants.HTTP_OK).json(user.getLight()))
          .catch(error => next(new Error(error)));
      })
      .catch(error => next(new Error(error)));
  }

  static getUser(req, res, next) {

    let id = req.params.id;

    User.doesExist(id)
      .then(exists => {

        if (!exists) {
          return res.status(constants.HTTP_NOT_FOUND).json({error: 'Unknown user'});
        }

        User.get(id)
          .then(user => res.status(constants.HTTP_OK).json(user.getLight()))
          .catch(error => next(new Error(error)));
      })
      .catch(error => next(new Error(error)));
  }

  static getUsers(req, res, next) {
    User.getAll()
      .then(users => res.status(constants.HTTP_OK).json(users))
      .catch(error => next(new Error(error)));
  }
};
