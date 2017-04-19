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

loadNews('https://mail.ru')
    .then(html => {
        let $ = cheerio.load(html);

        console.log('Топ-10 новостей с mail.ru:');
        $('.news__list__item').slice(0, 10).each((i, el) => {
            let news = $(el).find('.news__list__item__link__text');

            console.log('- ' + news.eq(0).text());
        });
    })
    .catch(err => {
        console.log(err);
    });