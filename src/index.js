/// <reference path='../typings/tsd.d.ts' />
var express = require('express');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var mongoose = require('mongoose');
var passportLocal = require('passport-local');
var socketIO = require('socket.io');
var t = require('./types');
var LocalStrategy = passportLocal.Strategy;
var handlebars = require('express-handlebars').create({ defaultLayout: 'main' });
var app = express();
var http = require('http').Server(app);
var io = socketIO(http);
var routes = require('./routes');
var models = require('./models');
app.set('port', process.env.PORT || 3000);
var serverURL = app.get('port');
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
app.get('/register', routes.registerWith({}));
app.post('/register', routes.register);
app.get('/', routes.auth, routes.redirectHome);
app.get('/home', routes.auth, routes.home(serverURL));
app.get('/view', routes.auth, routes.view);
app.get('/login', routes.getLogin);
app.get('/logout', routes.logout);
app.post('/login', routes.postLogin);
app.post('/click', routes.auth, routes.postClick);
app.get('/quizstart', routes.auth, routes.postQuiz(io, 0));
app.get('/quizstop', routes.auth, routes.postQuiz(io, 1));
var Account = models.Account;
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());
mongoose.connect('mongodb://localhost/click-express-mongoose');
var users = 0;
io.on('connection', function (socket) {
    var n = users++;
    console.log('user connected: ' + n);
    socket.on('disconnect', function () {
        console.log('bye-bye user: ' + n);
    });
});
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
http.listen(app.get('port'), function () {
    var msg = "Express START: http://localhost:"
        + serverURL
        + " press Ctrl-C to kill.";
    console.log(msg);
});
