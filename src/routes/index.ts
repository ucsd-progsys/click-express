/// <reference path='../../typings/tsd.d.ts' />

import express  = require('express');
import passport = require('passport');
var Account:any = require('../models/account'); // because the passport-mongoose-local adds stuff to it.
var router      = express.Router();

router.get('/', function (req, res) {
    res.render('index', { user : req.user });
});

router.get('/register', function(req, res) {
    res.render('register', { });
});


/*
app.get('/', (req, res) => {
  res.render('home');
  });

app.get('/about', (req, res) => {
  var msg = tips.randomTip();
  res.render('about', {tip : msg });
  });
*/


router.post('/register', function(req, res) {
  var acc = new Account({ username : req.body.username });
  Account.register(acc, req.body.password, function(err:any, account:any) {
    if (err) {
      return res.render('register', { account : account });
    }
    passport.authenticate('local')(req, res, function () {
      res.redirect('/');
    });
  });
});

router.get('/login', function(req, res) {
    res.render('login', { user : req.user });
});

router.post('/login', passport.authenticate('local'), function(req, res) {
    res.redirect('/');
});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

router.get('/ping', function(req, res){
    res.status(200).send("pong!");
});

module.exports = router;
