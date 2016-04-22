
// package imports
import express        = require('express');
import logger         = require('morgan');
import cookieParser   = require('cookie-parser');
import bodyParser     = require('body-parser');
import methodOverride = require('method-override');
import session        = require('express-session');
import passport       = require('passport');
import mongoose       = require('mongoose');
import path           = require('path');
import passportLocal  = require('passport-local');
import socketIO       = require('socket.io');

let LocalStrategy     = passportLocal.Strategy;
let handlebars        = require('express-handlebars');
let favicon           = require('serve-favicon');
// let flash          = require('connect-flash');
let app               = express();
let http              = require('http').Server(app);
let io                = socketIO(http);


import models         = require('./models/schemas');
import routes         = require('./controllers/routes');
import sockets        = require('./controllers/sockets');

import * as Course from './models/course';


////////////////////////////////////////////////////////////////////
// Express /////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////

app.set('port', process.env.PORT || 3000);
let serverPort = app.get('port');

////////////////////////////////////////////////////////////////////
// Views ///////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////

app.set('views', path.join(__dirname, '/../client/views'));
app.engine('handlebars', handlebars({
    defaultLayout: 'main',
    extname: '.handlebars',
    layoutsDir: path.join(__dirname, '/../client/views/layouts')
}));
app.set('view engine', 'handlebars');

////////////////////////////////////////////////////////////////////
// Sessions ////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, '../client/assets/favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));

// app.use(flash());


////////////////////////////////////////////////////////////////////
// Authentication //////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////

app.use(passport.initialize());
app.use(passport.session());

////////////////////////////////////////////////////////////////////
// Static Content //////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////

app.use(express.static(path.join(__dirname, '../client')));
app.use(express.static(path.join(__dirname, '../node_modules')));

////////////////////////////////////////////////////////////////////
// Routes //////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////

app.get ('/register'    ,              routes.registerWith({}));
app.post('/register'    ,              routes.register);
app.get ('/'            , routes.auth, routes.redirectHome);
app.get ('/home'        , routes.auth, routes.home(serverPort));
app.get ('/course'      , routes.auth, routes.courseSelect);
app.get ('/login'       ,              routes.getLogin);
app.get ('/logout'      ,              routes.logout);
app.get ('/history'     , routes.auth, routes.history);
app.get ('/history-data', routes.auth, routes.historyData);
app.get ('/courselist'  , routes.auth, routes.courseList);
app.post('/savequiz'    , routes.auth, routes.saveQuiz);
app.post('/login'       ,              routes.postLogin);
app.get ('/course/:course_id'          , routes.auth, routes.course);
app.get ('/course/:course_id/questions', routes.auth, routes.questions);
app.get ('/course/:course_id/create'   , routes.auth, routes.createQuiz);


////////////////////////////////////////////////////////////////////
// Passport config /////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////

let Account: any = models.Account;
// require('./models/account');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

////////////////////////////////////////////////////////////////////
// Mongoose ////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////

mongoose.connect('mongodb://localhost/click-express-mongoose');

////////////////////////////////////////////////////////////////////
// Sockets /////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////

// socket.setup(io);

io.on('connection', sockets.onConnect);


////////////////////////////////////////////////////////////////////
// Start me up /////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////

function handle404(err: any, req: express.Request, res: express.Response, next: Function) {
    res.status(404);
    res.render('404');
}

function handle500(err: any, req: express.Request, res: express.Response, next: Function) {
    console.error(err.stack);
    res.status(500);
    res.render('500');
}

// 404 page
app.use(handle404);

// 500 page
app.use(handle500);

// Go!
http.listen(app.get('port'), () => {
    console.log(
        'Express START: http://localhost:',
        serverPort, // app.get('port')
        'press Ctrl-C to kill.');
});
