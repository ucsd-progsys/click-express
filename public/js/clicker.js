var userName = userName || "UNKNOWN_USER";
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
function initSocket() { return (isHomeURL()) ? io() : null; }
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
var click = angular.module('click', ['ngAnimate', 'ui.bootstrap']);
