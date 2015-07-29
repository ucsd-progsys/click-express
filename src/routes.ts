/// <reference path='../typings/tsd.d.ts' />

import express  = require('express');
import passport = require('passport');
import models   = require('./models');
var Account:any = models.Account;
var router      = express.Router();
type Request    = express.Request;
type Response   = express.Response;
type RequestH   = express.RequestHandler;

////////////////////////////////////////////////////////////////////////
// Messages ////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

var msgUserExists = {info: "Sorry, that username already exists. Try again."};

////////////////////////////////////////////////////////////////////////
// Register ////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

export var registerWith = (z:Object) => {
  var h:RequestH = (req, res, next) => res.render('register', z);
  return h;
}

export function register(req:Request, res:Response){
  var acc = new Account({ username : req.body.username
                        , email    : req.body.email   });
  Account.register(acc, req.body.password, function(err:any, account:any) {
    if (err) return registerWith(msgUserExists)(req, res, undefined);
    passport.authenticate('local')(req, res, () => res.redirect('/')) ;
  });
}

////////////////////////////////////////////////////////////////////////
// Login ///////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

export var getLogin:RequestH = (req, res, next) => {
  res.render('login', { user : req.user });
}

export var postLogin = passport.authenticate('local', { successRedirect: '/home'
                                                    , failureRedirect: '/login' });


////////////////////////////////////////////////////////////////////////
// Authenticated Zone //////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

// Simple route middleware to ensure user is authenticated.
// Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.

export var auth:RequestH = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.render('index');
}

// INVARIANT: AUTH
export var redirectHome:RequestH = (req, res) => {
  res.redirect('/home');
}

// INVARIANT: AUTH
export var home : RequestH = (req, res) => {
  res.render('home', { user : req.user });
};

// INVARIANT: AUTH
export var view : RequestH = (req, res) => {
  res.render('view', { user : req.user });
}

export var logout : RequestH = (req,res) => {
  req.logout();
  res.redirect('/');
}

////////////////////////////////////////////////////////////////////////
// Post a new Click ////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

export var postClick: RequestH = (req, res) => {
  // req --> user, clickData
  // update model with user, clickData
  // respond with JSON("ok")
  return undefined;
}

export var getClicks: RequestH = (req, res) => {
  // req --> user --> JSON-with-clicks -> render view-with-json
  return undefined;
}
