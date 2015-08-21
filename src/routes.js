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
    var uid = req.user.username;
    console.log("UID: BEGIN");
    console.log(uid);
    console.log("UID: END");
    return uid;
}
function requestClick(req) {
    return { userId: requestUserId(req),
        choice: req.body.choice,
        submitTime: Date.now(),
        courseId: "CSE 130",
        problemId: "1"
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
exports.view = function (req, res) {
    var myId = requestUserId(req);
    console.log(myId);
    Click.find({ userId: myId }, function (err, clicks) {
        if (err) {
            console.log(err);
            res.render('view', { error: err.toString() });
        }
        else {
            console.log("Your clicks are: BEGIN");
            console.log(clicks);
            console.log("Your clicks are: END");
            res.render('view', { clicks: clicks });
        }
    });
};
