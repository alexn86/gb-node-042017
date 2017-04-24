const express = require('express');
const router = express.Router();
const news = require('../modules/news');

router.post('/', (req, res) => {
    if (!req.body.source || !req.body.category || !req.body.count) {
        return res.json({ data: 'Укажите данные!' });
    }

    news.load(req.body.category)
        .then(html => {
            res.cookie('source', req.body.source);
            res.cookie('category', req.body.category);
            res.cookie('count', req.body.count);

            return res.json({ data: news.get(req.body.source, html, req.body.count) });
        })
        .catch(err => {
            return res.json({ data: err });
        });
});

module.exports = router;