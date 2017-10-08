const constants = require('../constants');
const passport = require('passport');

const Logger = require('../logger');

module.exports = class AuthRoutes {
    static init(router) {
        Logger.info('Initialize authentication routes');

        router.get('/logged', (req, res) => {
            if (req.user) {
                res.json({
                    logged: true,
                    user: req.user.getLight()
                });
            } else {
                res.json({logged: false});
            }
        });

        router.post('/login', (req, res, next) => {
            passport.authenticate('local', (error, user, loginError) => {

                if (error) {
                    return next(error);
                }

                if (!user) {
                    return res.status(constants.HTTP_UNAUTHORIZED).json({error: loginError});
                }

                req.logIn(user, error => error ? next(error) : res.json(user.getLight()));

            })(req, res, next);
        });

        router.get('/logout', (req, res) => {
            req.logout();
            res.end();
        });
    }
};
