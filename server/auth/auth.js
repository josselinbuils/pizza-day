const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');
const session = require('express-session');

const config = require('../config');
const constants = require('../constants');
const Logger = require('../logger');
const User = require('../api/user/user.model');

module.exports = class Auth {

  static init(app) {
    Logger.info('Initialize authentication');

    app.use(session({
      secret: config.auth.secretKey,
      resave: constants.SESSION_RESAVE,
      saveUninitialized: constants.SESSION_SAVE_UNINITIALIZED
    }));

    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser((user, done) => done(null, user._id));
    passport.deserializeUser((id, done) => User.findById(id, (error, user) => done(error, user)));

    passport.use(new LocalStrategy({usernameField: 'email'}, (email, password, done) => {
      User.findOne({email: email}, (error, user) => {

        if (error) {
          return done(error, null, 'An error occurred');
        }

        if (!user) {
          return done(null, null, 'Unknown email address');
        }

        if (!user.isValidPassword(password)) {
          return done(null, null, 'Invalid password');
        }

        return done(null, user);
      });
    }));

    User.isThereAdmin().then(res => {
      if (!res) {
        Logger.info('Create admin user');

        let email = config.admin && config.admin.email ? config.admin.email : constants.DEFAULT_ADMIN_EMAIL;

        User.create({
          admin: true,
          email: email,
          firstName: 'Admin',
          lastName: 'ADMIN',
          password: config.password && config.admin.password ? config.admin.user : constants.DEFAULT_ADMIN_PASSWORD
        }).then(user => {
          Logger.info('Admin user "' + email + '" has been created');
        }).catch(error => {
          Logger.info('Error during creation of admin user "' + email + '": ' + error);
        });
      }
    });
  }

  static isAdmin(req, res, next) {

    if (req.user && req.user.isAdmin()) {
      return next();
    }

    res.status(constants.HTTP_FORBIDDEN).json({error: 'Only admin users can do that ;)'});
  }

  static isAuthenticated(req, res, next) {

    if (req.user) {
      return next();
    }

    res.status(constants.HTTP_UNAUTHORIZED).json({error: 'You are not logged in'});
  }
};

