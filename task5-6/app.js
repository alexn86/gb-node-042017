const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const templating = require('consolidate');
const path = require('path');
const config = require('./config');
const session = require('express-session');

const routerIndex = require('./routes/index');
const routerLogin = require('./routes/login');

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(
    `mongodb://${config.db.user}:${config.db.password}@${config.db.host}:${config.db.port}/${config.db.name}`
);

app.use(session({
    secret: 'secret',
    key: 'keys',
    resave: false,
    saveUninitialized: true,
    cookie: {
        path: '/',
        httpOnly: true,
        maxAge: null
    }
}));

app.engine('hbs', templating.handlebars);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// app.use(bodyParser.json());         // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routerIndex);
app.use('/login', routerLogin);
app.use('/logout', routerIndex);

app.listen(config.http.port, config.http.host, () => {
    console.log('Express server started on port %s at %s', config.http.port, config.http.host);
});