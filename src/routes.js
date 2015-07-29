/// <reference path='../typings/tsd.d.ts' />
var express = require('express');
var passport = require('passport');
var models = require('./models');
var Account = models.Account;
var router = express.Router();
var msgUserExists = { info: "Sorry, that username already exists. Try again." };
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
exports.postClick = function (req, res) {
    return undefined;
};
exports.getClicks = function (req, res) {
    return undefined;
};
