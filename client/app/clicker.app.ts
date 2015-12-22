
/// <reference path='../../typings/tsd.d.ts' />

declare var angular;
declare var serverURL: string;
declare var io: SocketIOStatic;

///////////////////////////////////////////////////////////////////////
// URL API ////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////

function getServerURL() {
    return window.location.protocol + "//" + window.location.host;
}

// function getClickURL() {
//     return getServerURL() + '/click';
// }

// function getQuizStartURL() {
//     return getServerURL() + '/quizstart';
// }

// function getQuizStopURL() {
//     return getServerURL() + '/quizstop';
// }

function getHistoryURL() {
    return getServerURL() + '/history';
}

function getSaveQuizURL() {
    return getServerURL() + '/savequiz';
}

function isHomeURL() {
    return (window.location.pathname === '/home');
}

function getQuestionsURL() {
    return getServerURL() + '/questions';
}

////////////////////////////////////////////////////////////////////////
// Globally Useful Type Definitions ////////////////////////////////////
////////////////////////////////////////////////////////////////////////

const QUIZ_START       = "QUIZ_START";
const QUIZ_STOP        = "QUIZ_STOP";
const QUIZ_ANSWER      = "QUIZ_ANSWER";
const REQ_QUIZ_RESULTS = "REQ_QUIZ_RESULTS";
const RES_QUIZ_RESULTS = "RES_QUIZ_RESULTS";
const JOIN_CLASSROOM   = "JOIN_CLASSROOM";

const ERROR_RESPONCE = "ERROR";

////////////////////////////////////////////////////////////////////////
// Globally Useful Functions ///////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

let serverError = ($scope, data, status, e) => {
    let s = "Request failed: " + e;
    $scope.label = s;
    let msg = (data || s) + status;
    alert(msg);
}

// HTML generation
let wrapIn = (msg: string, symbol: string) => ['<' , symbol, '>', msg, 
                                                '</', symbol, '>'].join('');
let inDiv  = (s: string) => wrapIn(s, 'div');
let inP    = (s: string) => wrapIn(s, 'p');
let inBold = (s: string) => wrapIn(s, 'b');

let charFromInt = (n: number) => String.fromCharCode(65 + n);

function quizToHtml(q: IQuiz, showCorrect?: boolean) {
    return (q) ? questionToHtml(q.description, q.options, showCorrect ? q.correct : undefined) : "";
}

function quizDescriptionToHtml(q: IQuiz) {
    return marked(q.description);
}

function questionToHtml(msg: string, opts: string[], correct?: number) {    
    let withUndef = o => (o) ? o : "";
    let optStrs = opts.map((o, i) => 
        (i === correct) ? inBold(charFromInt(i) + '. ' + withUndef(o)) :
                          inBold(charFromInt(i) + '. ') + withUndef(o));    
    let sep = "<hr>"
    return marked([msg, sep].concat(optStrs).join('\n\n'));
}

////////////////////////////////////////////////////////////////////////
// App Declaration /////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

var click = angular.module('click', [
	'ngAnimate',           // Modal element (optional)
	'ui.bootstrap',        // Modal element
	'ngSanitize',          // Markdown html sanitization
	'ng.bs.dropdown'       // dropdown
    ]);


click.factory('Data', function () {
    return { 
        courseName: '',
        userName  : '',
        socket    : undefined
    };
});
