/// <reference path='../typings/tsd.d.ts' />

// package imports
import express        = require('express');
import logger         = require('morgan');
import cookieParser   = require('cookie-parser');
import bodyParser     = require('body-parser');
import methodOverride = require('method-override');
import session        = require('express-session');
import passport       = require('passport');
import  path          = require('path');
import passportLocal  = require('passport-local');
var LocalStrategy     = passportLocal.Strategy;
var handlebars        = require('express-handlebars').create({ defaultLayout: 'main' });
// var favicon           = require('serve-favicon');

// local imports
import tips           = require("./tips");
var routes:any        = require('./routes/index');
import users          = require('./routes/users');


////////////////////////////////////////////////////////////////////
// Express /////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
var app = express();

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
// Views ///////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////

app.use('/', routes);


// 404 page
app.use((req, res, next) => {
  res.status(404);
  res.render('404');
  });

// 500 page
app.use((err: any, req:any, res:any, next:any) => {
  console.error(err.stack);
  res.status(500);
  res.render('500');
  });

////////////////////////////////////////////////////////////////////
// Start me up /////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////

app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), function(){
  var msg = "Express START: http://localhost:"
          + app.get('port')
          + " press Ctrl-C to kill.";
  console.log(msg);
});
