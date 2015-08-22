/// <reference path='../typings/tsd.d.ts' />
var express = require('express');
var passport = require('passport');
var models = require('./models');
var t = require('./types');
var Account = models.Account;
var Click = models.Click;
var router = express.Router();
var msgUserExists = { kind: t.Message.UserExists,
    info: "Sorry, that username already exists. Try again." };
var msgClickFail = { kind: t.Message.ClickFail,
    info: false };
var msgClickOk = function (n) { return ({ kind: t.Message.ClickOk,
    info: n }); };
var msgQuiz = function (msg) { return ({ kind: msg,
    info: Date.now() }); };
var msgQuizAck = { kind: t.Message.QuizAck };
exports.registerWith = function (z) {
    var h = function (req, res, next) { return res.render('register', z); };
    return h;
};
function register(req, res) {
    var acc = new Account({ username: req.body.username,
        email: req.body.email });
    Account.register(acc, req.body.password, function (err, account) {
        if (err)
            return exports.registerWith(msgUserExists)(req, res, undefined);
        passport.authenticate('local')(req, res, function () { return res.redirect('/'); });
    });
}
exports.register = register;
exports.getLogin = function (req, res, next) {
    res.render('login', { user: req.user });
};
exports.postLogin = passport.authenticate('local', { successRedirect: '/home',
    failureRedirect: '/login' });
exports.auth = function (req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.render('index');
};
exports.redirectHome = function (req, res) {
    res.redirect('/home');
};
function home(url) {
    return function (req, res) {
        res.render('home', { user: req.user,
            serverURL: url });
    };
}
exports.home = home;
exports.logout = function (req, res) {
    req.logout();
    res.redirect('/');
};
function requestUserId(req) {
    return req.user.username;
}
var defaults = { courseId: "CSE 130",
    problemId: "1"
};
function requestClick(req) {
    return { userId: requestUserId(req),
        choice: req.body.choice,
        submitTime: Date.now(),
        courseId: defaults.courseId,
        problemId: defaults.problemId
    };
}
exports.postClick = function (req, res) {
    var ci = requestClick(req);
    new Click(ci).save(function (err, click) {
        if (err) {
            console.log(err);
            res.json(msgClickFail);
        }
        else {
            res.json(msgClickOk(ci.choice));
        }
        ;
    });
};
function postQuiz(io, msg) {
    return function (req, res) {
        io.emit('message', msgQuiz(msg));
        res.json(msgQuizAck);
    };
}
exports.postQuiz = postQuiz;
exports.view = function (req, res) {
    var myId = requestUserId(req);
    Click.find({ userId: myId }, function (err, clicks) {
        if (err) {
            res.render('view', { error: err.toString() });
        }
        else {
            res.render('view', { clicks: clicks });
        }
    });
};
