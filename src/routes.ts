/// <reference path='../../typings/tsd.d.ts' />

import express  = require('express');
import passport = require('passport');
import models   = require('../models');
var Account:any = models.Account;
var router      = express.Router();
// var Account:any = require('../models/account'); // because the passport-mongoose-local adds stuff to it.

////////////////////////////////////////////////////////////////////////
// Home page ///////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

router.get('/', function (req, res) {
  if (req.isAuthenticated()) {
    res.redirect('/home');
  } else {
    res.render('index', { user : req.user });
  }
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

router.post('/login', passport.authenticate('local', { successRedirect: '/home'
                                                     , failureRedirect: '/login' }));


////////////////////////////////////////////////////////////////////////
// Authenticated Zone //////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

// Simple route middleware to ensure user is authenticated.
// Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.

var ensureAuthenticated : express.RequestHandler = function (req, res, next){
  if (req.isAuthenticated())
    return next();
  res.redirect('/login')
}

// INVARIANT: Should ONLY be here if authenticated/logged in.
router.get('/home', ensureAuthenticated, function(req, res) {
  res.render('home', { user : req.user });
});


// INVARIANT: Should ONLY be here if authenticated/logged in.
router.get('/view', ensureAuthenticated, function(req, res) {
  res.render('view', { user : req.user });
});


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
