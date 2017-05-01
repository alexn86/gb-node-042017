const mongoose = require('mongoose');
const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const config = require('./config');
const User = require('./models/user');

mongoose.Promise = global.Promise;
mongoose.connect(
    `mongodb://${config.db.user}:${config.db.password}@${config.db.host}:${config.db.port}/${config.db.name}`
);

let login = '',
    password = '';

rl.question('Логин: ', answer => {
    login = answer;

    rl.question('Пароль: ', answer => {
        password = answer;
        rl.close();
    });
});

rl.on('close', () => {
    const newUser = new User({ login: login, password: password });

    User
        .findOne({ login: login })
        .then(u => {
            if (u) {
                throw new Error('Такой пользователь уже существует!');
            }

            return newUser.save();
        })
        .then(u => console.log('ok!'), e => console.error(e.message))
        .then(() => process.exit(0));
});