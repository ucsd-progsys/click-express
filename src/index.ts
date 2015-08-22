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
var handlebars        = require('express-handlebars').create({ defaultLayout: 'main' });
// var favicon        = require('serve-favicon');
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

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

////////////////////////////////////////////////////////////////////
// Sessions ////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
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

app.use(express.static('public'));

////////////////////////////////////////////////////////////////////
// Routes //////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////

app.get( '/register'  ,              routes.registerWith({}));
app.post('/register'  ,              routes.register);
app.get( '/'          , routes.auth, routes.redirectHome);
app.get( '/home'      , routes.auth, routes.home(serverURL));
app.get( '/view'      , routes.auth, routes.view);
app.get( '/login'     ,              routes.getLogin);
app.get( '/logout'    ,              routes.logout);
app.post('/login'     ,              routes.postLogin);

// TODO: auth-student
app.post('/click'     , routes.auth, routes.postClick);

// TODO: auth-instructor
app.post('/quizstart' , routes.auth, routes.postQuiz(io, t.Message.QuizStart));
app.post('/quizstop'  , routes.auth, routes.postQuiz(io, t.Message.QuizStop));


////////////////////////////////////////////////////////////////////
// Passport config /////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////

var Account:any = models.Account;
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

io.on('connection', function(socket){
  var n = users++;
  console.log('user connected: ' + n);
  socket.on('disconnect', function(){
    console.log('bye-bye user: ' + n);
  });
});

////////////////////////////////////////////////////////////////////
// Start me up /////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////

var handle404:express.ErrorRequestHandler = function(err, req, res, next){
  res.status(404);
  res.render('404');
}

var handle500:express.ErrorRequestHandler = function(err, req, res, next){
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
