const express = require('express');
const router = express.Router();
const User = require('../models/user');
const crypto = require('crypto');

const isAuth = (req, res, next) => {
    if (!req.session.isAuth) {
        return next();
    }

    res.redirect('/');
};

router.get('/', isAuth, (req, res) => {
    res.render('login');
});

router.post('/', (req, res) => {
    const obj = {};

    if (!req.body.login || !req.body.password) {
        obj.status = 'Вы не ввели логин и/или пароль!';
        res.render('login', obj);
    } else {
        const password = crypto.createHash('md5').update(req.body.password).digest('hex');

        User
            .findOne(({ login: req.body.login, password: password }))
            .then(item => {
                if (!item) {
                    obj.status = 'Логин и/или пароль введены неверно!';
                    res.render('login', obj);
                } else {
                    req.session.isAuth = true;
                    req.session.userName = req.body.login;
                    res.redirect('/');
                }
            });
    }
});

module.exports = router;