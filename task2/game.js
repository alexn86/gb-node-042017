const readline = require('readline');
const path = require('path');
const minimist = require('minimist');
const fs = require('fs');
const colors = require('colors');

let game = (() => {
    let logfile, rl;

    let run = () => {
        let side = Math.round(Math.random() + 1);

        rl.question('Орёл(1) или Решка(2): ', (value) => {
            if (value === 'exit') {
                console.log('Спасибо за игру!'.rainbow);
                rl.close();

                return;
            }

            value = +value;
            if (valid(value)) {
                if (side === value) {
                    console.log('Да'.green);
                    log('win');
                } else {
                    console.log('Нет'.red);
                    log('loss');
                }
            }

            run();
        });
    };

    let log = (data) => {
        if (logfile) {
            fs.appendFile(path.join(__dirname, logfile), data + '\n');
        }
    };

    let valid = (value) => {

        if (isNaN(value)) {
            console.log('Введите число!');

            return false;
        } else if (value < 1 || value > 2) {
            console.log('Неверное число!');

            return false;
        }

        return true;
    };

    return {
        init() {
            rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });

            logfile = minimist(process.argv.slice(2))['_'][0];
            if (logfile) {
                fs.writeFile(path.join(__dirname, logfile), '');
            }

            run();
        }
    }
})();

game.init();