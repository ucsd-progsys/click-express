/// <reference path='../typings/node/node.d.ts' />
/// <reference path='../typings/express/express.d.ts' />
// <reference path='../typings/errorhandler/errorhandler.d.ts' />

import express = require('express');
// import errorHandler = require("errorhandler");

var app = express();

app.set('port', process.env.PORT || 3000);

app.get('/', function(req, res){
  res.type('text/plain');
  res.send('Web Clicker: ROOT');
  });

app.get('/about', function(req, res){
  res.type('text/plain');
  res.send('Web Clicker: ABOUT');
  });
  
// 404 page
app.use(function(req, res){
  res.type('text/plain');
  res.status(404);
  res.send("404 - I still havent found what you're looking for");
  });

// 500 page
app.use((err: any, req:any, res:any, next:any) => {
   res.status(err.status || 500);
   res.type('text/plain');
   res.send("500 - Yikes! Server error!");
});

app.listen(app.get('port'), function(){
  var msg = "Express START: http://localhost:" +
            app.get('port') +
            " press Ctrl-C to kill.";
  console.log(msg);
});
