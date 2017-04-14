const fs = require('fs');
const path = require('path');
const minimist = require('minimist');

let analyzer = (() => {
    let logfile;

    let readFile = () => {
        return new Promise((resolve, reject) => {
            fs.readFile(path.join(__dirname, logfile), 'utf-8', (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    };

    let analyze = (data) => {
        let rounds = data.split('\n').slice(0, -1);
        let winCount = rounds.filter(item => item === 'win').length;
        let loseCount = rounds.filter(item => item === 'loss').length;

        let winLength = 0,
            maxWinLength = 0,
            lossLength = 0,
            maxLossLength = 0;

        for (let i = 0; i < rounds.length; i++) {
            // считаем максимальное число побед
            if (rounds[i] === 'win') {
                winLength++;
            } else {
                if (maxWinLength < winLength) {
                    maxWinLength = winLength;
                }
                winLength = 0;
            }
            if (i === rounds.length - 1 && maxWinLength < winLength) {
                maxWinLength = winLength;
            }

            // считаем максимальное число проигрышей
            if (rounds[i] === 'loss') {
                lossLength++;
            } else {
                if (maxLossLength < lossLength) {
                    maxLossLength = lossLength;
                }
                lossLength = 0;
            }
            if (i === rounds.length - 1 && maxLossLength < lossLength) {
                maxLossLength = lossLength;
            }
        }

        console.log('Количество партий: ' + rounds.length);
        console.log('Количество побед: ' + winCount);
        console.log('Количество проигрышей: ' + loseCount);
        console.log('Процент побед: ' + Math.round(winCount / (loseCount + winCount) * 100) + '%');
        console.log('Процент проигрышей: ' + Math.round(loseCount / (loseCount + winCount) * 100) + '%');
        console.log('Максимальное число побед подряд: ' + maxWinLength);
        console.log('Максимальное число проигрышей подряд: ' + maxLossLength);
    };

    return {
        init() {
            logfile = minimist(process.argv.slice(2))['_'][0];

            readFile()
                .then(data => {
                    analyze(data);
                })
                .catch(err => {
                    console.error(err);
                });
        }
    }
})();

analyzer.init();
