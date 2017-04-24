const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    const { source, category, count } = req.cookies;
    const obj = {
        source,
        category,
        count,
        title: 'Загрузчик новостей'
    };

    res.render('index', obj);
});

module.exports = router;