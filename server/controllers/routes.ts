/// <reference path='../../typings/tsd.d.ts' />

import express  = require('express');
import passport = require('passport');
import socketIO = require('socket.io');
import t        = require('../helper/types');
import path     = require('path');
import fs       = require('fs');


import { Account, Click, Quiz, UserId } from '../models/schemas'
import { Request, RequestH, Response }  from '../helper/types'

var router      = express.Router();

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
// Constants ///////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

const CLASSES = JSON.stringify([ 'CSE130', 'CSE230' ]);

////////////////////////////////////////////////////////////////////////
// Register ////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

export function registerWith(z: Object): RequestH {
    return (req, res, next) => res.render('register', z);
}

export function register(req: Request, res: Response) {
    let acc = new Account({
        username: req.body.username,
        email: req.body.email
    });
    console.log('USER: ' + req.body.username);
    console.log('PASS: ' + req.body.password);
    Account.register(acc, req.body.password, (err: any) => {
        if (err) { 
            return registerWith(msgUserExists)(req, res, undefined);
        }
        passport.authenticate('local')(req, res, () => res.redirect('/'));
    });
}

////////////////////////////////////////////////////////////////////////
// Login ///////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

export var getLogin: RequestH = (req, res, next) => {
    res.render('login', {
        user : req.user
    });
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

function isInstructorReq(req: express.Request) {
    return req.user.username === 'instructor';
}

export function home(url:string): RequestH {
    return (req, res) => {
        if (isInstructorReq(req)) {
            Quiz.find({ 'courseId': 'CSE130' }, (err: any, quizzes: IQuiz[]) => {
                // console.log('####### FOUND IDS');
                // console.log(JSON.stringify(quizzes, null, '  '));
                res.render('instructor', {
                    user: req.user,
                    isInstructor: true,
                    serverURL : url,
                    courseList: CLASSES,     // TODO: get them from the db
                    questionPool: JSON.stringify(quizzes)
                });
            });
        }
        else {
            res.render('student', {
                user: req.user,
                isInstructor: false,
                serverURL : url,
                courseList: CLASSES          // TODO: get them from the db
            });
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

function requestUserId(req: Request): UserId {
    return req.user.username;
}

////////////////////////////////////////////////////////////////////////
// View Click History //////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

// INVARIANT: AUTH

export let history: RequestH = (req, res) => {
    res.render('history', {
        courseList: CLASSES,      // TODO: get them from the db
        isInstructor: isInstructorReq(req),
    });
}

export let historyData: RequestH = (req, res) => {
    let myId = requestUserId(req);
    Click.find({ userId: myId }).exec((err: any, clicks: any) => {
        if (err) {
            res.render('history', {
                error: err.toString(),
                courseList: CLASSES      // TODO: get them from the db
            })
        } else {
            res.json(clicks);
        }
    });
}

////////////////////////////////////////////////////////////////////////
// Create Quiz /////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

export let createQuiz: RequestH = (req, res) => {
    res.render('create', {
        user: req.user,
        isInstructor: isInstructorReq(req),
        courseList: CLASSES     // TODO: get them from the db
    });
}

export let saveQuiz: RequestH = (req, res) => {
    let username    = req.user.username;
    let quiz: IQuiz = req.body;
    // console.log('user ', req.user.username, ' created quiz: ');
    // console.log(quiz);
    new Quiz(quiz).save((err, _) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log('quiz from ', quiz.author, ' saved.');
            res.json({ satus: 'OK' });
        }
    });
}
