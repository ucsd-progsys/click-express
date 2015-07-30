/// <reference path='../typings/tsd.d.ts' />
var express = require('express');
var passport = require('passport');
var models = require('./models');
var Account = models.Account;
var Click = models.Click;
var router = express.Router();
var msgUserExists = { info: "Sorry, that username already exists. Try again." };
var msgClickFail = { status: false };
var msgClickOk = function (n) { return ({ status: true, value: n }); };
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
exports.home = function (req, res) {
    res.render('home', { user: req.user });
};
exports.view = function (req, res) {
    res.render('view', { user: req.user });
};
exports.logout = function (req, res) {
    req.logout();
    res.redirect('/');
};
function requestClick(req) {
    return { userId: requestUserId(req),
        choice: req.body.choice,
        submitTime: Date.now(),
        courseId: "CSE 130",
        problemId: "1"
    };
}
function requestUserId(req) {
    return req.body.username;
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
exports.getClicks = function (req, res) {
    var myId = requestUserId(req);
    Click.find({ userId: myId }, function (err, clicks) {
        if (err) {
            console.log(err);
            res.render('view', { error: err.toString() });
        }
        else {
            res.render('view', { clicks: clicks });
        }
    });
};
