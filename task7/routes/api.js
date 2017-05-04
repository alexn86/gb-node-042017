const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const jwt = require('jsonwebtoken');
const config = require('../config');

router.use((req, res, next) => {
    const token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (token) {
        jwt.verify(token, config.secret, (err, decoded) => {
            if (err) {
                return res.json({ success: false, message: 'Failed to authenticate token.' });
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });
    }
});

router.get('/posts', (req, res) => {
    Post.find({})
        .then(posts => res.json({ success: true, posts: posts ? posts : [] }))
        .catch(err => res.status(404).send({ success: false, message: err.message }));
});

router.get('/posts/:id', (req, res) => {
    Post.findById(req.params.id)
        .then(post => res.json({ success: true, post: post }))
        .catch(err => res.status(404).send({ success: false, message: err.message }));
});

router.post('/posts', (req, res) => {
    if (!req.body.title || !req.body.date || !req.body.text) {
        res.status(403).send({
            success: false,
            message: 'No data provided.'
        });
    } else {
        const { title, date, text } = req.body;
        const newPost = new Post({ title, date, text });

        newPost.save()
            .then(post => res.json({ success: true, post: post }))
            .catch(err => res.status(404).send({ success: false, message: err.message }));
    }
});

router.put('/posts/:id', (req, res) => {
    if (!req.body.title || !req.body.date || !req.body.text) {
        res.status(403).send({
            success: false,
            message: 'No data provided.'
        });
    } else {
        const { title, date, text } = req.body;

        Post.update({ _id: req.params.id }, { title, date, text })
            .then(status => res.json({ success: true, status: status }))
            .catch(err => res.status(404).send({ success: false, message: err.message }));
    }

});

router.delete('/posts/:id', (req, res) => {
    if (!req.params.id) {
        res.status(403).send({
            success: false,
            message: 'No id provided.'
        });
    } else {
        Post.deleteOne({ _id: req.params.id })
            .then(status => res.json({ success: true, status: status }))
            .catch(err => res.status(404).send({ success: false, message: err.message }));
    }
});

module.exports = router;