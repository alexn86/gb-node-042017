const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const templating = require('consolidate');
const path = require('path');
const config = require('./config');
const mongoose = require('mongoose');
const morgan = require('morgan');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const passport = require('passport');
const routerIndex = require('./routes/index');
const routerApi = require('./routes/api');
const routerAuth = require('./routes/auth');

require('./passport')(passport);

mongoose.Promise = global.Promise;
mongoose.connect(config.db.url);

app.engine('hbs', templating.handlebars);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(morgan('dev'));
app.use(cookieParser('secret'));
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
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routerIndex);
app.use('/api', routerApi);
app.use('/auth', routerAuth);

app.listen(config.http.port, config.http.host, () => {
    console.log('Express server started on port %s at %s', config.http.port, config.http.host);
});