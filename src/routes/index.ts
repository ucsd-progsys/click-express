/// <reference path='../../typings/tsd.d.ts' />

import express  = require('express');
import passport = require('passport');
var Account:any = require('../models/account'); // because the passport-mongoose-local adds stuff to it.
var router      = express.Router();

////////////////////////////////////////////////////////////////////////
// Home page ///////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

router.get('/', function (req, res) {
    res.render('index', { user : req.user });
});

////////////////////////////////////////////////////////////////////////
// Register ////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

router.get('/register', function(req, res) {
    res.render('register', { });
});

router.post('/register', function(req, res) {
  var acc = new Account({ username : req.body.username
                        , email    : req.body.email
                        });

  Account.register(acc, req.body.password, function(err:any, account:any) {
    if (err) {
      return res.render('register', {info: "Sorry, that username already exists. Try again."});
    }
    passport.authenticate('local')(req, res, function () {
      res.redirect('/');
    });
  });
});

////////////////////////////////////////////////////////////////////////
// Login ///////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

router.get('/login', function(req, res) {
    res.render('login', { user : req.user });
});

router.post('/login', passport.authenticate('local', { successRedirect: '/'
                                                     , failureRedirect: '/login' }));

////////////////////////////////////////////////////////////////////////
// Logout //////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

module.exports = router;

/*
app.get('/about', (req, res) => {
  var msg = tips.randomTip();
  res.render('about', {tip : msg });
  });

router.get('/ping', function(req, res){
    res.status(200).send("pong!");
});
*/
