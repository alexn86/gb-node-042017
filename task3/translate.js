const readline = require('readline');
const request = require('request');

let translate = (() => {
    let rl;

    let getTranslate = (text) => {
        return new Promise((resolve, reject) => {
            let query = 'https://translate.yandex.net/api/v1.5/tr.json/translate?'
                + 'key=trnsl.1.1.20170419T172108Z.e4d630947ff79307.f790aca48dd9d6be903412593d79dd857e0ee460'
                + `&text=${text}`
                + '&lang=en-ru';

            request(query, (err, res, data) => {
                if (err) {
                    reject(err);
                } else if (res.statusCode !== 200) {
                    reject(new Error('Ошибка при переводе!'));
                } else {
                    resolve(JSON.parse(data));
                }
            });
        });
    };

    let run = () => {
        rl.question('Введите слово на английском: ', (value) => {

            if (value === 'exit;') {
                console.log('Bye!');
                rl.close();

                return;
            }

            getTranslate(value)
                .then(data => {
                    console.log(data.text[0]);
                    run();
                })
                .catch(err => {
                    console.log(err);
                });
        });
    };

    return {
        init() {
            rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });

            run();
        }
    }
})();

translate.init();