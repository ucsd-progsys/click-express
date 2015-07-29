/// <reference path='../typings/tsd.d.ts' />
var express = require('express');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var mongoose = require('mongoose');
var passportLocal = require('passport-local');
var LocalStrategy = passportLocal.Strategy;
var handlebars = require('express-handlebars').create({ defaultLayout: 'main' });
var routes = require('./routes');
var models = require('./models');
var app = express();
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('public'));
app.use('/', routes);
var Account = models.Account;
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());
mongoose.connect('mongodb://localhost/click-express-mongoose');
var handle404 = function (err, req, res, next) {
    res.status(404);
    res.render('404');
};
var handle500 = function (err, req, res, next) {
    console.error(err.stack);
    res.status(500);
    res.render('500');
};
app.use(handle404);
app.use(handle500);
app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), function () {
    var msg = "Express START: http://localhost:"
        + app.get('port')
        + " press Ctrl-C to kill.";
    console.log(msg);
});
