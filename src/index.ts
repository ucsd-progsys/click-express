/// <reference path='../typings/tsd.d.ts' />

// package imports
import express        = require('express');
import logger         = require('morgan');
import cookieParser   = require('cookie-parser');
import bodyParser     = require('body-parser');
import methodOverride = require('method-override');
import session        = require('express-session');
import passport       = require('passport');
import LocalStrategy  = require('passport-local');

// local imports
import tips           = require("./tips");

// import "express-handlebars" (no d.ts)
import ehb = require('express-handlebars');
var hb:any = ehb;
var handlebars = hb.create({ defaultLayout: 'main' });

// express
var app = express();

// middleware: sessions
app.use(function(req:any, res:any, next:any){
  var err = req.session.error,
      msg = req.session.notice,
      success = req.session.success;

  delete req.session.error;
  delete req.session.success;
  delete req.session.notice;

  if (err) res.locals.error = err;
  if (msg) res.locals.notice = msg;
  if (success) res.locals.success = success;

  next();
});

// middleware: handlebars
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', process.env.PORT || 3000);

app.get('/', (req, res) => {
  res.render('home');
  });

app.get('/about', (req, res) => {
  var msg = tips.randomTip();
  res.render('about', {tip : msg });
  });

// static
app.use(express.static('public'));

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

// Start me up
app.listen(app.get('port'), function(){
  var msg = "Express START: http://localhost:"
          + app.get('port')
          + " press Ctrl-C to kill.";
  console.log(msg);
});
