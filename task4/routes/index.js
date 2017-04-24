const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    let obj = {
        title: 'Загрузчик новостей',
        source: req.cookies.source,
        category: req.cookies.category,
        count: req.cookies.count ? req.cookies.count : 10
    };

    res.render('index', obj);
});

module.exports = router;