const express = require('express');
const router = express.Router();
const Post = require('../models/post');

router.get('/', (req, res) => {
    const obj = {};

    Post.list().then(items => {
        obj.posts = items;
        obj.isAuth = req.session.isAuth;
        obj.userName = obj.isAuth ? req.session.userName : 'Гость';
        res.render('index', obj);
    });
});

router.get('/add', (req, res) => {
    const obj = {};

    obj.action = '/add';
    res.render('form', obj);
});

router.post('/add', (req, res) => {
    const obj = {};

    obj.data = req.body;
    delete obj.data._id;

    Post.valid(req.body)
        .then(
            post => Post.add(post)
        )
        .then(
            () => res.redirect('/')
        )
        .catch((e) => {
            obj.status = e.message;
            res.render('form', obj);
        });
});

router.get('/edit', (req, res) => {
    const obj = {};

    Post.get(req.query._id).then(
        item => {
            obj.data = item;
            obj.action = '/edit';
            res.render('form', obj);
        }
    );
});

router.post('/edit', (req, res) => {
    const obj = {};

    obj.data = req.body;

    Post.valid(req.body)
        .then(
            post => Post.edit(post)
        )
        .then(
            () => res.redirect('/')
        )
        .catch((e) => {
            obj.status = e.message;
            res.render('form', obj);
        });
});

router.get('/delete', (req, res) => {
    if (req.query._id) {
        Post.delete(req.query._id).then(
            () => res.redirect('/'),
            () => res.redirect('/')
        );
    } else {
        res.redirect('/');
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;