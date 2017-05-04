const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const config = require('../config');
const url = `http://${config.http.host}:${config.http.port}`;

function isAuth(req, res, next) {
    if (req.session.isAuth) {
        return next();
    }

    res.redirect('/login');
}

router.get('/', (req, res) => {
    const obj = {};

    fetch(url + '/api/posts', {
        method: 'GET',
        headers: {
            'x-access-token': req.cookies.token
        }
    })
        .then(response => {
            return response.json();
        })
        .then(data => {
            obj.isAuth = req.session.isAuth;
            obj.userName = obj.isAuth ? req.session.userName : 'Гость';
            if (data.success) {
                obj.posts = data.posts;
            } else {
                obj.status = data.message;
            }
            res.render('index', obj);
        });
});

router.get('/add', isAuth, (req, res) => {
    res.render('form', { action: '/add' });
});

router.post('/add', isAuth, (req, res) => {
    const body = `title=${req.body.title}&date=${req.body.date}&text=${req.body.text}`;

    fetch(url + '/api/posts', {
        method: 'POST',
        body: body,
        headers: {
            'x-access-token': req.cookies.token,
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': new Buffer(body).length
        }
    })
        .then(response => {
            return response.json();
        })
        .then(data => {
            if (data.success) {
                res.redirect('/');
            } else {
                res.render('form', { status: data.message });
            }
        });
});

router.get('/edit', isAuth, (req, res) => {

    fetch(url + '/api/posts/' + req.query.id, {
        method: 'GET',
        headers: {
            'x-access-token': req.cookies.token
        }
    })
        .then(response => {
            return response.json();
        })
        .then(data => {
            if (data.success) {
                res.render('form', { data: data.post, action: '/edit' });
            } else {
                res.render('index', { status: data.message });
            }
        });
});

router.post('/edit', isAuth, (req, res) => {
    const body = `title=${req.body.title}&date=${req.body.date}&text=${req.body.text}`;

    fetch(url + '/api/posts/' + req.body.id, {
        method: 'PUT',
        body: body,
        headers: {
            'x-access-token': req.cookies.token,
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': new Buffer(body).length
        }
    })
        .then(response => {
            return response.json();
        })
        .then(data => {
            if (data.success) {
                res.redirect('/');
            } else {
                res.render('form', { status: data.message });
            }
        });
});

router.get('/delete', isAuth, (req, res) => {
    fetch(url + '/api/posts/' + req.query.id, {
        method: 'DELETE',
        headers: {
            'x-access-token': req.cookies.token
        }
    })
        .then(response => {
            return response.json();
        })
        .then(data => {
            res.redirect('/');
        });
});

module.exports = router;