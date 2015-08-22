/// <reference path='../typings/tsd.d.ts' />

import express  = require('express');
import passport = require('passport');
import models   = require('./models');
var Account:any = models.Account;
var Click       = models.Click;
var router      = express.Router();
type Request    = express.Request;
type Response   = express.Response;
type RequestH   = express.RequestHandler;



////////////////////////////////////////////////////////////////////////
// Messages ////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

var msgUserExists = {info: "Sorry, that username already exists. Try again."};
var msgClickFail  = {status: false}
var msgClickOk    = (n:number) => ({status: true, value: n})

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
export function home(url:string): RequestH {
  return (req, res) => { res.render('home', { user      : req.user
                                            , serverURL : url}); }
}

export var logout : RequestH = (req,res) => {
  req.logout();
  res.redirect('/');
}

////////////////////////////////////////////////////////////////////////
// Post a new Click ////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

function requestUserId(req:Request):models.UserId {
  var uid = req.user.username;
  console.log("UID: BEGIN");
  console.log(uid);
  console.log("UID: END");
  return uid;
}

var defaults = { courseId  : "CSE 130"
               , problemId : "1"
               };

function requestClick(req:Request):models.ClickI {
  return { userId     : requestUserId(req)
         , choice     : req.body.choice
         , submitTime : Date.now()
         , courseId   : defaults.courseId
         , problemId  : defaults.problemId
         }
}

export var postClick: RequestH = (req, res) => {
  var ci = requestClick(req);
  new Click(ci).save(function( err, click ){
    if (err) {
      console.log(err);
      res.json( msgClickFail )
    } else {
      res.json( msgClickOk(ci.choice) )
    };
  });
}


////////////////////////////////////////////////////////////////////////
// View Previous Clicks ////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

// INVARIANT: AUTH
// export var view : RequestH = (req, res) => {
//  res.render('view', { user : req.user });
// }

export var view: RequestH = (req, res) => {
  var myId = requestUserId(req);
  console.log(myId);
  Click.find( {userId : myId }, function ( err:any, clicks:any){
    if (err) {
      console.log(err);
      res.render ('view', { error : err.toString() })
    } else {
      console.log("Your clicks are: BEGIN");
      console.log(clicks);
      console.log("Your clicks are: END");
      res.render( 'view', { clicks : clicks } );
    }
  });
}
