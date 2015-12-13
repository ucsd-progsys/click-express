
declare var serverURL: string;
declare var angular: any;
declare var io: any;
declare var markdown: any;

////////////////////////////////////////////////////////////////////////
// Globally Useful Type Definitions ////////////////////////////////////
////////////////////////////////////////////////////////////////////////

const QUIZ_CREATE = "QUIZ_CREATE";
const QUIZ_BCAST  = "QUIZ_BCAST";
const QUIZ_STOP   = "QUIZ_STOP";


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

////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

function initSocket() {
    if (isHomeURL())
        return io();
    return null;
}

var choices = { 1: 'A', 2: 'B', 3: 'C', 4: 'D', 5: 'E' };
var debug = false;
var socket = io(); // initSocket();

////////////////////////////////////////////////////////////////////////

function setStatus($scope, s: t.Status) {
    $scope.status = s;
    $scope.isWaiting = (s === t.Status.Clicked);
    $scope.isOff = (s === t.Status.Off);
    // debug             = $scope.isOff;
}

// function setQuiz($scope, msg: t.SocketEvent) {
//     switch (msg.kind) {
//         case t.Message.QuizStart:
//             setStatus($scope, t.Status.Quiz);
//             $scope.quiz = "ON: " + msg.info;
//             break;
//         case t.Message.QuizStop:
//             setStatus($scope, t.Status.Off);
//             $scope.quiz = "OFF";
//             break;
//         default:
//             break;
//     }
//     // alert($scope.quiz);
// }

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


///////////////////////////////////////////////////////////////////////


function clickCtrl($scope, $http, $location) {

    // INIT
    $scope.label = "(none)";
    setStatus($scope, t.Status.Off);
    
    let userName = "DEFAULT_USER";      // TODO     
    
    // Student    
    let quizzes: { [x: number]: t.QuizPost} = {};    
    
    // Instructor    
    // Quiz count 
    let quizCount = 0;

    // RECV: quiz notifications (over socket)
    // socket.on('message', (msg) => $scope.$apply(() => setQuiz($scope, msg)));
    
    socket.on(QUIZ_BCAST, (msg: t.QuizPost) => {        
        // console.log('Checking for ' + msg.id + ' in keys: ' + 
        //     Object.getOwnPropertyNames(quizzes).join(', ') + ' ' + 
        //     quizzes.hasOwnProperty(msg.id.toString()));        

        // // Check for duplicate
        // if (quizzes.hasOwnProperty(msg.id.toString())) { 
        //     console.log("Found key"); 
        //     return;
        // }
        // quizzes[msg.id] = msg;
        
        console.log(QUIZ_BCAST + ' from ' + msg.name + ' message: ' + msg.message);
        angular.element(document.getElementById('space-for-questions')).append(markdown.toHTML(msg.message));
    });
    

    // // SEND: click responses
    // $scope.clickChoose = (n) => {
    //     var cn = choices[n];
    //     $scope.label = cn + "(pending)";
    //     setStatus($scope, t.Status.Waiting);

    //     $http.post(getClickURL(), { choice: n })
    //         .success(function(data, status) {
    //             setStatus($scope, t.Status.Quiz);
    //             $scope.label = cn;
    //         })
    //         .error(function(data, status) {
    //             serverError($scope, data, status, "click");
    //         });
    // }
        
    
  
    // SUBMIT: post question
    $scope.submit = () => {
        if ($scope.text) {
            let quiz = makeQuiz($scope.text);
            // console.log(QUIZ_CREATE + ' : ' + $scope.text);
            socket.emit(QUIZ_CREATE, quiz);
        }
    }       

    // // SEND: Start QUIZ
    // $scope.quizStart = () => {
    //     setStatus($scope, t.Status.Waiting);
    //     $http.post(getQuizStartURL(), { time: Date.now() })
    //         .success(function(data, status) {
    //             setStatus($scope, t.Status.Quiz);
    //         })
    //         .error(function(data, status) {
    //             serverError($scope, data, status, "quizstart");
    //         })
    //     return;
    // }

    // // SEND: Stop Quiz
    // $scope.quizStart = function() {
    //     setStatus($scope, t.Status.Waiting);
    //     $http.post(getQuizStopURL(), { time: Date.now() })
    //         .success(function(data, status) {
    //             setStatus($scope, t.Status.Off);
    //         })
    //         .error(function(data, status) {
    //             serverError($scope, data, status, "quizstop");
    //         })
    //     return;
    // }
    
    function makeQuiz(text: string): t.QuizPost {
        return {
            id: quizCount++,
            name: userName,
            message: text
        };        
    }
    
    
    
}

var click = angular.module('click', []);
click.controller('clickCtrl', clickCtrl);
