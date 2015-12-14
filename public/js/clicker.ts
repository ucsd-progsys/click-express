declare var angular;

// locals
// ugly -- imported through JavaScript: main.handlebars
var userName: string = userName || "UNKNOWN_USER";

declare var serverURL: string;
declare var io: any;
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

function isHomeURL() {
    return (window.location.pathname === '/home');
}


function initSocket() { return (isHomeURL()) ? io() : null; }

////////////////////////////////////////////////////////////////////////
// Globally Useful Type Definitions ////////////////////////////////////
////////////////////////////////////////////////////////////////////////

const QUIZ_CREATE = "QUIZ_CREATE";
const QUIZ_BCAST = "QUIZ_BCAST";
const QUIZ_STOP = "QUIZ_STOP";


module t {

	export type MessageDscr = string;

	export enum Message {
		QuizCreate,
		QuizBCast,
		QuizStop,
		QuizAck,
		UserExists,
		ClickFail,
		ClickOk
	}

	export enum Status {
		Off,
		Quiz,
		Clicked
	}

	export interface SocketEvent {
		kind: MessageDscr,
		info: any
	}

	export interface QuizPost {
		id: number;
		name: string;       // Instructors name
		message: string;    // Question (TODO: in Markdown) 
	}

}


let serverError = ($scope, data, status, e) => {
    var s = "Request failed: " + e;
    $scope.label = s;
    var msg = (data || s) + status;
    alert(msg);
}


let wrapIn = (msg: string, symbol: string) => '<' + symbol + '>' + msg + '</' + symbol + '>';
let wrapInDiv = (s: string) => wrapIn(s, 'div');
let wrapInP = (s: string) => wrapIn(s, 'p');
let wrapInBlockQuote = (s: string) => wrapIn(s, 'blockquote');
let formatQuiz = (msg: string) => wrapInBlockQuote(wrapInP(msg));   


var click = angular.module('click', [
	'ngAnimate', 		// Modal element (optional)
	'ui.bootstrap', 	// Modal element
	'ngSanitize'  		// Markdown html sanitization
	]);
