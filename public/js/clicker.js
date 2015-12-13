var QUIZ_CREATE = "QUIZ_CREATE";
var QUIZ_BCAST = "QUIZ_BCAST";
var QUIZ_STOP = "QUIZ_STOP";
var t;
(function (t) {
    (function (Message) {
        Message[Message["QuizCreate"] = 0] = "QuizCreate";
        Message[Message["QuizBCast"] = 1] = "QuizBCast";
        Message[Message["QuizStop"] = 2] = "QuizStop";
        Message[Message["QuizAck"] = 3] = "QuizAck";
        Message[Message["UserExists"] = 4] = "UserExists";
        Message[Message["ClickFail"] = 5] = "ClickFail";
        Message[Message["ClickOk"] = 6] = "ClickOk";
    })(t.Message || (t.Message = {}));
    var Message = t.Message;
    (function (Status) {
        Status[Status["Off"] = 0] = "Off";
        Status[Status["Quiz"] = 1] = "Quiz";
        Status[Status["Clicked"] = 2] = "Clicked";
    })(t.Status || (t.Status = {}));
    var Status = t.Status;
})(t || (t = {}));
function getServerURL() {
    return window.location.protocol + "//" + window.location.host;
}
function getClickURL() {
    return getServerURL() + '/click';
}
function getQuizStartURL() {
    return getServerURL() + '/quizstart';
}
function getQuizStopURL() {
    return getServerURL() + '/quizstop';
}
function isHomeURL() {
    return (window.location.pathname === '/home');
}
function initSocket() {
    if (isHomeURL())
        return io();
    return null;
}
var choices = { 1: 'A', 2: 'B', 3: 'C', 4: 'D', 5: 'E' };
var debug = false;
var socket = io();
function setStatus($scope, s) {
    $scope.status = s;
    $scope.isWaiting = (s === t.Status.Clicked);
    $scope.isOff = (s === t.Status.Off);
}
var serverError = function ($scope, data, status, e) {
    var s = "Request failed: " + e;
    $scope.label = s;
    var msg = (data || s) + status;
    alert(msg);
};
var wrapIn = function (msg, symbol) { return '<' + symbol + '>' + msg + '</' + symbol + '>'; };
var wrapInDiv = function (s) { return wrapIn(s, 'div'); };
var wrapInP = function (s) { return wrapIn(s, 'p'); };
var wrapInBlockQuote = function (s) { return wrapIn(s, 'blockquote'); };
var formatQuiz = function (msg) { return wrapInBlockQuote(wrapInP(msg)); };
function clickCtrl($scope, $http, $location) {
    $scope.label = "(none)";
    setStatus($scope, t.Status.Off);
    var userName = "DEFAULT_USER";
    var quizzes = {};
    var quizCount = 0;
    socket.on(QUIZ_BCAST, function (msg) {
        // console.log('Checking for ' + msg.id + ' in keys: ' + 
        //     Object.getOwnPropertyNames(quizzes).join(', ') + ' ' + 
        //     quizzes.hasOwnProperty(msg.id.toString()));        
        console.log(QUIZ_BCAST + ' from ' + msg.name + ' message: ' + msg.message);
        angular.element(document.getElementById('space-for-questions')).append(markdown.toHTML(msg.message));
    });
    $scope.submit = function () {
        if ($scope.text) {
            var quiz = makeQuiz($scope.text);
            socket.emit(QUIZ_CREATE, quiz);
        }
    };
    function makeQuiz(text) {
        return {
            id: quizCount++,
            name: userName,
            message: text
        };
    }
}
var click = angular.module('click', []);
click.controller('clickCtrl', clickCtrl);
