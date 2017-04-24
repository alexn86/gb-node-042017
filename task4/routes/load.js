const express = require('express');
const router = express.Router();
const request = require('request');
const cheerio = require('cheerio');

function loadNews(url) {
    return new Promise((resolve, reject) => {
        request(url, (err, res, html) => {
            if (err) {
                reject(err);
            } else if (res.statusCode !== 200) {
                reject(new Error('Не удалось загрузить страницу!'));
            } else {
                resolve(html);
            }
        });
    });
}

function getNews(source, html, count) {
    let data = {};

    switch (source) {
        case 'ria':
            data = { data: parseRia(html, count) };
            break;
        case 'championat':
            data = { data: parseChampionat(html, count) };
            break;
        default:
            data = { data: 'Ничего нет' };
    }

    return data;
}

function parseRia(html, count) {
    let $ = cheerio.load(html);
    let data = [];

    $('.b-list__item').slice(0, count).each((i, el) => {
        let news = $(el).find('.b-list__item-title');

        data.push({ title: news.eq(0).text() })
    });

    return data;
}

function parseChampionat(html, count) {
    let $ = cheerio.load(html);
    let data = [];

    $('.list-articles__i').slice(0, count).each((i, el) => {
        let news = $(el).find('.list-articles__i__text');

        data.push({ title: news.eq(0).text() })
    });

    return data;
}

router.post('/', (req, res) => {
    if (!req.body.source || !req.body.category || !req.body.count) {
        return res.json({ data: 'Укажите данные!' });
    }

    loadNews(req.body.category)
        .then(html => {
            res.cookie('source', req.body.source);
            res.cookie('category', req.body.category);
            res.cookie('count', req.body.count);

            return res.json({ data: getNews(req.body.source, html, req.body.count) });
        })
        .catch(err => {
            return res.json({ data: err });
        });
});

module.exports = router;