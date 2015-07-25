
/// <reference path='../typings/tsd.d.ts' />

// <reference path='../typings/node/node.d.ts' />
// <reference path='../typings/express/express.d.ts' />
// <reference path='../typings/express-handlebars/express-handlebars.d.ts' />
// <reference path='../typings/errorhandler/errorhandler.d.ts' />

import express    = require('express');
var app = express();

import ehb = require('express-handlebars');
var hb:any = ehb;
var handlebars = hb.create({ defaultLayout: 'main' });

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.set('port', process.env.PORT || 3000);

app.get('/', (req, res) => {
  res.render('home');
  });

app.get('/about', (req, res) => {
  var msg = randomTip();
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
  res.render('404');
  });


// Start me up
app.listen(app.get('port'), function(){
  var msg = "Express START: http://localhost:"
          + app.get('port')
          + " press Ctrl-C to kill.";
  console.log(msg);
});

////////////////////////////////////////////////////////////////////////////////
// move into another file
////////////////////////////////////////////////////////////////////////////////

var tips = [ "Man does not live on bread alone"
           , "Judge not lest ye be judged"
           , "She works just 3 days a week"
           ];

function randomTip(){
  var n = Math.floor(Math.random() * tips.length);
  return tips[n];
}
