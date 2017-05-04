const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');
const jwt = require('jsonwebtoken');
const config = require('./config');

module.exports = passport => {
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });

    passport.use('local-login', new LocalStrategy(
        {
            usernameField: 'login',
            passwordField: 'password',
            passReqToCallback: true
        },
        (req, login, password, done) => {
            User.findOne({ 'login': login }, (err, user) => {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    return done(null, false, req.flash('loginMessage', 'No user found.'));
                }
                if (!user.validPassword(password)) {
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
                }

                // req.token = jwt.sign(user, config.secret);

                return done(null, user);
            });

        }
    ));

    passport.use('local-signup', new LocalStrategy(
        {
            usernameField: 'login',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        (req, login, password, done) => {
            User.findOne({ 'login': login }, (err, user) => {
                if (err) {
                    return done(err);
                }
                if (user) {
                    return done(null, false, req.flash('signupMessage', 'That login is already taken.'));
                } else {
                    const newUser = new User();

                    newUser.login = login;
                    newUser.password = newUser.generateHash(password);
                    newUser.save(err => {
                        if (err) {
                            throw err;
                        }

                        return done(null, newUser);
                    });
                }

            });
        }
    ));
};