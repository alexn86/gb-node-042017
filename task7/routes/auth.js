const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const config = require('../config');
// const passport = require('passport');

function isAuth(req, res, next) {
    if (req.session.isAuth) {
        return next();
    }

    res.redirect('/auth/login');
}

function isNotAuth(req, res, next) {
    if (!req.session.isAuth) {
        return next();
    }

    res.redirect('/');
}

router.get('/login', isNotAuth, (req, res) => {
    res.render('login', { status: req.flash('loginMessage') });
});
// router.post('/login', passport.authenticate('local-login', {
//     successRedirect: '/',
//     failureRedirect: '/login',
//     failureFlash: true
// }));
router.post('/login', isNotAuth, (req, res) => {
    if (!req.body.login || !req.body.password) {
        req.flash('loginMessage', 'Вы не ввели логин и/или пароль!');
        res.redirect('/auth/login');
    } else {
        User
            .findOne(({ login: req.body.login }))
            .then(item => {
                if (!item) {
                    req.flash('loginMessage', 'Пользователь с таким логином не найден!');
                    res.redirect('/auth/login');
                } else if (!item.validPassword(req.body.password)) {
                    req.flash('loginMessage', 'Неверный пароль!');
                    res.redirect('/auth/login');
                } else {
                    req.session.isAuth = true;
                    req.session.userName = req.body.login;
                    res.cookie('token', jwt.sign(item, config.secret));
                    res.redirect('/');
                }
            });
    }
});

router.get('/signup', isNotAuth, (req, res) => {
    res.render('signup', { status: req.flash('signupMessage') });
});
// router.post('/signup', passport.authenticate('local-signup', {
//     successRedirect: '/',
//     failureRedirect: '/signup',
//     failureFlash: true
// }));
router.post('/signup', isNotAuth, (req, res) => {
    if (!req.body.login || !req.body.password) {
        req.flash('signupMessage', 'Введите логин и пароль!');
        res.redirect('/auth/signup');
    } else {
        User
            .findOne(({ login: req.body.login }))
            .then(item => {
                if (item) {
                    req.flash('signupMessage', 'Такой логин уже есть!');
                    res.redirect('/auth/signup');
                } else {
                    const newUser = new User();

                    newUser.login = req.body.login;
                    newUser.password = newUser.generateHash(req.body.password);
                    newUser.save();

                    req.session.isAuth = true;
                    req.session.userName = req.body.login;
                    res.redirect('/');
                }
            });
    }
});

router.get('/logout', isAuth, (req, res) => {
    // req.logout();
    req.session.destroy();
    res.clearCookie('token');
    res.redirect('/');
});

module.exports = router;