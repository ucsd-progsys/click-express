/// <reference path='../../typings/tsd.d.ts' />
var express = require('express');
var passport = require('passport');
var models = require('../models');
var Account = models.Account;
var router = express.Router();
router.get('/', function (req, res) {
    if (req.isAuthenticated()) {
        res.redirect('/home');
    }
    else {
        res.render('index', { user: req.user });
    }
});
router.get('/register', function (req, res) {
    res.render('register', {});
});
router.post('/register', function (req, res) {
    var acc = new Account({ username: req.body.username,
        email: req.body.email
    });
    Account.register(acc, req.body.password, function (err, account) {
        if (err) {
            return res.render('register', { info: "Sorry, that username already exists. Try again." });
        }
        passport.authenticate('local')(req, res, function () {
            res.redirect('/');
        });
    });
});
router.get('/login', function (req, res) {
    res.render('login', { user: req.user });
});
router.post('/login', passport.authenticate('local', { successRedirect: '/home',
    failureRedirect: '/login' }));
var ensureAuthenticated = function (req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/login');
};
router.get('/home', ensureAuthenticated, function (req, res) {
    res.render('home', { user: req.user });
});
router.get('/view', ensureAuthenticated, function (req, res) {
    res.render('view', { user: req.user });
});
router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});
module.exports = router;
