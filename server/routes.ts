/// <reference path='../typings/tsd.d.ts' />

import express  = require('express');
import passport = require('passport');
import models   = require('./models');
import socketIO = require('socket.io');
import t        = require('./types');
import path     = require('path');
import fs       = require('fs');

var Account:any = models.Account;
var Click       = models.Click;
var router      = express.Router();
type Request    = express.Request;
type Response   = express.Response;
type RequestH   = express.RequestHandler;


const QUESTIONS_FILE = path.join(__dirname, "data/questions.json")


////////////////////////////////////////////////////////////////////////
// Messages ////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

var msgUserExists = {
    kind   : Message.UserExists
  , info   : "Sorry, that username already exists. Try again."
}

var msgClickFail  = {
    kind   : Message.ClickFail
  , info   : false
}

var msgClickOk = (n:number) => ({
    kind   : Message.ClickOk
  , info   : n
})

var msgQuiz = (msg: Message) => ({
    kind   : msg
  , info   : Date.now()
})

// var msgQuizAck : t.SocketEvent = {
//     kind   : t.Message.QuizAck
//   , info   : true
// }

function sendSocket(io:SocketIO.Server, e: SocketEvent) {
  io.emit('message', e);
}

function sendHttp(res:express.Response, e:SocketEvent) {
  res.json(e);
}

////////////////////////////////////////////////////////////////////////
// Register ////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

export var registerWith = (z: Object) => {
    var h: RequestH = (req, res, next) => res.render('register', z);
    return h;
}

export function register(req: Request, res: Response) {
    let acc = new Account({ username: req.body.username, email: req.body.email });
    console.log('USER: ' + req.body.username);
    console.log('PASS: ' + req.body.password);
    Account.register(acc, req.body.password, (err:any, account:any) => {
        if (err) return registerWith(msgUserExists)(req, res, undefined);
        passport.authenticate('local')(req, res, () => res.redirect('/'));
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

export var auth: RequestH = (req, res, next) => {
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
        if (req.user.username === 'instructor') {
            fs.readFile(QUESTIONS_FILE, 'utf8', function (err, data) {
                console.log('reading file');
                if (err) throw err;
                let obj = JSON.stringify(JSON.parse(data));                
                console.log(obj)
                res.render('post-question', { user: req.user, serverURL : url, questionPool: obj})
            });

        }
        else {
            res.render('render-question', { user: req.user, serverURL : url});
        }
    }
}

export var logout : RequestH = (req,res) => {
    req.logout();
    res.redirect('/');
}

////////////////////////////////////////////////////////////////////////
// Post a new Click ////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

function requestUserId(req: Request): models.UserId {
    return req.user.username;
}

var defaults = { courseId : "CSE 130"
               , quizId   : "1"
               };

// export function requestClick(a: t.StudentClick): models.ClickI {
//   return { userId     : a.userId
//          , choice     : a.choice
//          , submitTime : a.submissionTime
//          , courseId   : defaults.courseId
//          , quizId     : defaults.quizId
//          }
// }

////////////////////////////////////////////////////////////////////////
// View Click History //////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

// INVARIANT: AUTH

export let history: RequestH = (req, res) => {
    res.render('history');
}

export let historyData: RequestH = (req, res) => {
    let myId = requestUserId(req);
    Click.find({ userId: myId }).exec((err: any, clicks: any) => {
        if (err) {
            res.render('history', { error: err.toString() })
        } else {
            res.json(clicks);
        }
    });
}

////////////////////////////////////////////////////////////////////////
// Send existing questions /////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

/*
{
    "courseId"   : "CSE130",
    "description": "C99 standard guarantees uniqueness of ____ characters for internal names.",
    "options"    : [{ "index": "A", "text" : "31" }
                    { "index": "B", "text" : "63" }
                    { "index": "C", "text" : "12" }
                    { "index": "D", "text" : "14" }],
    "correct"    : "B",
    "author"     : "rjhala"
}
*/

// const QUESTIONS_FILE = path.join(__dirname, "data/questions.json")

// export let quizContent: RequestH = (req, res) => {
//     fs.readFile(QUESTIONS_FILE, 'utf8', function (err, data) {
//         console.log('reading file');
//         if (err) throw err;
//         let obj = JSON.parse(data);
//         console.log(obj);
//         console.log(data);
//         res.json(obj);
//     });
// }
