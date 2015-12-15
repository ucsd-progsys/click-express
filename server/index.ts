/// <reference path='../typings/tsd.d.ts' />

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
import t              = require('./types');

var LocalStrategy     = passportLocal.Strategy;
var handlebars        = require('express-handlebars');
var favicon           = require('serve-favicon');
// var flash          = require('connect-flash');
var app               = express();
var http              = require('http').Server(app);
var io                = socketIO(http);


// local imports
import tips           = require("./tips");
import routes         = require('./routes');
import models         = require('./models');


////////////////////////////////////////////////////////////////////
// Express /////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////

app.set('port', process.env.PORT || 3000);
var serverURL = app.get('port');

////////////////////////////////////////////////////////////////////    
// Views ///////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////

app.set('views', path.join(__dirname, '/../client/views'));
app.engine('handlebars', handlebars({ 
    defaultLayout: 'main', 
    extname: '.handlebars',
    layoutsDir: path.join(__dirname, '../client/views/layouts')
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
app.use(session({ secret: 'keyboard cat'
                , resave: false
                , saveUninitialized: false }));
                
// app.use(flash());


////////////////////////////////////////////////////////////////////
// Authentication //////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////

app.use(passport.initialize());
app.use(passport.session());

////////////////////////////////////////////////////////////////////
// Static Content //////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////

app.use(express.static('client'));
app.use(express.static('node_modules'));

////////////////////////////////////////////////////////////////////
// Routes //////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////

app.get( '/register' ,              routes.registerWith({}));
app.post('/register' ,              routes.register);
app.get( '/'         , routes.auth, routes.redirectHome);
app.get( '/home'     , routes.auth, routes.home(serverURL));
// app.get( '/view'     , routes.auth, routes.view);
app.get( '/login'    ,              routes.getLogin);
app.get( '/logout'   ,              routes.logout);
app.post('/login'    ,              routes.postLogin);
// app.post('/click'    , routes.auth, routes.postClick);                          // TODO: auth-student
// app.get( '/quizstart', routes.auth, routes.postQuiz(io, t.QUIZ_CREATE)); // TODO: auth-instructor
// app.get( '/quizstop' , routes.auth, routes.postQuiz(io, t.QUIZ_STOP));   // TODO: auth-instructor

////////////////////////////////////////////////////////////////////
// Passport config /////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////

var Account: any = models.Account;
// require('./models/account');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

////////////////////////////////////////////////////////////////////
// Mongoose ////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////

mongoose.connect('mongodb://localhost/click-express-mongoose');

////////////////////////////////////////////////////////////////////
// WebSockets: Pushing Questions to Clients ////////////////////////
////////////////////////////////////////////////////////////////////

var users = 0;
var quizInProgress = false;

io.on('connection', (socket) => {

    var n = users++;
    console.log('user connected: ' + n);

    // Disconnect
    socket.on('disconnect', () => console.log('bye-bye user: ' + n));

    // Instructor started a quiz - broadcast it!
    socket.on(t.QUIZ_START, (msg: t.QuizPost) => {
        io.emit(t.QUIZ_START, msg);
    });
    
    // Instructor stopped a quiz - broadcast it!
    socket.on(t.QUIZ_STOP, (data: any) => {
        io.emit(t.QUIZ_STOP, data); 
    });

    // Student sent a click
    socket.on(t.QUIZ_ANS, (click: t.QuizAnswer) => {
        // console.log(click.time + ' :: ' + 
        //             click.userId + ' answered to ' + 
        //             click.quizId + ' with ' + 
        //             click.answer);
        let ci = routes.requestClick(click);
        new models.Click(ci).save((err, click) => {
            if (err) console.log(err);
        });
    });

});

////////////////////////////////////////////////////////////////////
// Start me up /////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////

var handle404: express.ErrorRequestHandler = (err, req, res, next) => {
    res.status(404);
    res.render('404');
}

var handle500: express.ErrorRequestHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500);
    res.render('500');
}

// 404 page
app.use(handle404);

// 500 page
app.use(handle500);

// Go!
http.listen(app.get('port'), function(){
  var msg = "Express START: http://localhost:"
          + serverURL // app.get('port')
          + " press Ctrl-C to kill.";
  console.log(msg);
});
