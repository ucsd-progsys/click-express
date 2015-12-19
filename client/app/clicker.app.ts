
/// <reference path='../../typings/tsd.d.ts' />

declare var angular;

// locals
// ugly -- imported through JavaScript: main.handlebars
var userName: string = userName || "UNKNOWN_USER";

declare var serverURL: string;
declare var io: SocketIOStatic;
declare let showdown;

///////////////////////////////////////////////////////////////////////
// URL API ////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////

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

function getHistoryURL() {
    return getServerURL() + '/history';
}

function isHomeURL() {
    return (window.location.pathname === '/home');
}

////////////////////////////////////////////////////////////////////////
// Globally Useful Type Definitions ////////////////////////////////////
////////////////////////////////////////////////////////////////////////

const QUIZ_START     = "QUIZ_START";
const QUIZ_STOP      = "QUIZ_STOP";
const QUIZ_ANS       = "QUIZ_ANS";
const QUIZ_SAVE      = "QUIZ_SAVE";
const QUIZ_SAVED     = "QUIZ_SAVED";

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
let wrapIn 			 = (msg: string, symbol: string) => '<'  + symbol + '>' + msg + 
                                                        '</' + symbol + '>';
let wrapInDiv 		 = (s: string) => wrapIn(s, 'div');
let wrapInP 		 = (s: string) => wrapIn(s, 'p');
let wrapInBlockQuote = (s: string) => wrapIn(s, 'blockquote');
let wrapInBold		 = (s: string) => wrapIn(s, 'b');
let formatQuiz 		 = (msg: string) => wrapInBlockQuote(wrapInP(msg));

// let converter = new showdown.Converter();

function charFromInt(n: number) {
    return String.fromCharCode(65 + n);
}

function fullQuestionToHtml(question: string, opts: Options) {
    let withUndef = o => (o) ? o : "";
    let optStrs   = opts.map((o, i) => wrapInBold(charFromInt(i) + '. ' + withUndef(o)));
    let fullStr   = [question].concat(optStrs).join('\n\n');
    return marked(fullStr);
}

function questionToHtml(q: IQuizContent) {    
    return marked(q.description);
}

////////////////////////////////////////////////////////////////////////
// App Declaration /////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

var click = angular.module('click', [
	'ngAnimate', 		// Modal element (optional)
	'ui.bootstrap', 	// Modal element
	'ngSanitize',  		// Markdown html sanitization
	'ng.bs.dropdown'
	]);


click.controller('navCtrl', 
    ['$scope', '$location', function($scope, $location) {
        
        $scope.courseName = 'CSE130';
        console.log('navCtrol')
        $scope.onSelectCourse= (course: string) => {
            $scope.courseName = course;
        } 
        
        // $scope.navClass = function(page) {
        //     var currentRoute = $location.path().substring(1) || 'home';
        //     return page === currentRoute ? 'active' : '';
        // };

        // $scope.loadHome = function() {
        //     $location.url('/home');
        // };

        // $scope.loadAbout = function() {
        //     $location.url('/about');
        // };

        // $scope.loadContact = function() {
        //     $location.url('/contact');
        // };

    }]);