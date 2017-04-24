const request = require('request');
const cheerio = require('cheerio');

function parse(html, parent, child, count) {
    const $ = cheerio.load(html);
    const data = [];

    $(parent).slice(0, count).each((i, el) => {
        data.push({ title: $(el).find(child).eq(0).text() })
    });

    return data;
}

exports.get = function (source, html, count) {
    let data = {};

    switch (source) {
        case 'ria':
            data = { data: parse(html, '.b-list__item', '.b-list__item-title', count) };
            break;
        case 'championat':
            data = { data: parse(html, '.list-articles__i', '.list-articles__i__text', count) };
            break;
        default:
            data = { data: 'Ничего нет' };
    }

    return data;
};

exports.load = function (url) {
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
};