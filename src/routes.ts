/// <reference path='../typings/tsd.d.ts' />

import express  = require('express');
import passport = require('passport');
import models   = require('./models');
import socketIO = require('socket.io');
import t        = require('./types');

var Account:any = models.Account;
var Click       = models.Click;
var router      = express.Router();
type Request    = express.Request;
type Response   = express.Response;
type RequestH   = express.RequestHandler;

////////////////////////////////////////////////////////////////////////
// Messages ////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

var msgUserExists = {
    kind   : t.Message.UserExists
  , info   : "Sorry, that username already exists. Try again."
}

var msgClickFail  = {
    kind   : t.Message.ClickFail
  , info   : false
}

var msgClickOk = (n:number) => ({
    kind   : t.Message.ClickOk
  , info   : n
})

var msgQuiz = (msg:t.Message) => ({
    kind   : msg
  , info   : Date.now()
})

// var msgQuizAck : t.SocketEvent = {
//     kind   : t.Message.QuizAck
//   , info   : true
// }

function sendSocket(io:SocketIO.Server, e:t.SocketEvent) {
  io.emit('message', e);
}

function sendHttp(res:express.Response, e:t.SocketEvent) {
  res.json(e);
}

////////////////////////////////////////////////////////////////////////
// Register ////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

export var registerWith = (z:Object) => {
  var h:RequestH = (req, res, next) => res.render('register', z);
  return h;
}

export function register(req: Request, res: Response){
  var acc = new Account({ username : req.body.username
                        , email    : req.body.email   });
  console.log('USER: ' + req.body.username);
  console.log('PASS: ' + req.body.password);
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

export var postLogin = 
    passport.authenticate('local', { successRedirect: '/home'
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
  if (req.isAuthenticated()) {
    console.log('auth: OK'); // , req.user.username)
    return next();
  }
  console.log('auth: FAIL'); // , req.user.username)
  res.render('index');
}

// INVARIANT: AUTH
export var redirectHome: RequestH = (req, res) => {
    res.redirect('/home');
}

// INVARIANT: AUTH
export function home(url:string): RequestH {
    return (req, res) => {
        (req.user.username === 'instructor') ?
            res.render('instructor-home', { user: req.user, serverURL : url}):          
            res.render('student-home', { user: req.user, serverURL : url});     
    }
}

export var logout : RequestH = (req,res) => {
    req.logout();
    res.redirect('/');
}

////////////////////////////////////////////////////////////////////////
// Post a new Click ////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

function requestUserId(req:Request):models.UserId {
  return req.user.username;
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

// export var postClick: RequestH = (req, res) => {
//   var ci = requestClick(req);
//   new Click(ci).save(function( err, click ){
//     if (err) {
//       console.log(err);
//       sendHttp(res, msgClickFail)
//     } else {
//       sendHttp(res, msgClickOk(ci.choice))
//     };
//   });
// }


////////////////////////////////////////////////////////////////////////
// Post a new Quiz  ////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

// // INVARIANT: AUTH
// export function postQuiz(io:SocketIO.Server, msg:t.Message): RequestH {
//   console.log("Posting Quiz ...");
//   return (req, res) => {
//     sendSocket(io, msgQuiz(msg));
//     sendHttp(res, msgQuizAck);
//   }
// }

////////////////////////////////////////////////////////////////////////
// View Previous Clicks ////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

// INVARIANT: AUTH
// export var view : RequestH = (req, res) => {
//  res.render('view', { user : req.user });
// }

export var view: RequestH = (req, res) => {
  var myId = requestUserId(req);
  // console.log(myId);
  Click.find( {userId : myId }, function ( err:any, clicks:any){
    if (err) {
      // console.log(err);
      res.render ('view', { error : err.toString() })
    } else {
      // console.log("Your clicks are: BEGIN");
      // console.log(clicks);
      // console.log("Your clicks are: END");
      res.render( 'view', { clicks : clicks } );
    }
  });
}
