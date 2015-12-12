declare var serverURL: string;
declare var angular: any;
declare var io: any;
// declare var alert     : any;


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
/// COPY-PASTED FROM ../../src/types.ts ////////////////////////////////
////////////////////////////////////////////////////////////////////////

const enum Message {
    QuizStart
    , QuizStop
    , QuizAck
    , UserExists
    , ClickFail
    , ClickOk
}

const enum Status {
    Off
    , Quiz
    , Waiting
}

interface SocketEvent {
    kind: Message
    , info: any
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

function setStatus($scope, s: Status) {
    $scope.status = s;
    $scope.isWaiting = (s === Status.Waiting);
    $scope.isOff = (s === Status.Off);
    // debug             = $scope.isOff;
}

function setQuiz($scope, msg: SocketEvent) {
    switch (msg.kind) {
        case Message.QuizStart:
            setStatus($scope, Status.Quiz);
            $scope.quiz = "ON: " + msg.info;
            break;
        case Message.QuizStop:
            setStatus($scope, Status.Off);
            $scope.quiz = "OFF";
            break;
        default:
            break;
    }
    // alert($scope.quiz);
}

function serverError($scope, data, status, e) {
    var s = "Request failed: " + e;
    $scope.label = s;
    var msg = (data || s) + status;
    alert(msg);
}

function formatQuestion(msg: string) {
    return "<div><blockquote>" + msg + "</blockquote></div>";
}

///////////////////////////////////////////////////////////////////////


function clickCtrl($scope, $http, $location) {

    // INIT
    $scope.label = "(none)";
    setStatus($scope, Status.Off);

    // RECV: quiz notifications (over socket)
    // socket.on('message', (msg) => $scope.$apply(() => setQuiz($scope, msg)));
    
    socket.on('question:new', (msg) => {
        console.log('Got message: ' + msg);
        angular.element(document.getElementById('space-for-questions')).append(formatQuestion(msg));
    });
    

    // SEND: click responses
    $scope.clickChoose = (n) => {
        var cn = choices[n];
        $scope.label = cn + "(pending)";
        setStatus($scope, Status.Waiting);

        $http.post(getClickURL(), { choice: n })
            .success(function(data, status) {
                setStatus($scope, Status.Quiz);
                $scope.label = cn;
            })
            .error(function(data, status) {
                serverError($scope, data, status, "click");
            });
    }
  
    // SUBMIT: post question
    $scope.submit = () => {
        if ($scope.text) {
            // console.log('posting text:');
            // console.log($scope.text);            
            socket.emit('question:post', $scope.text);
        }
    }       

    // SEND: Start QUIZ
    $scope.quizStart = () => {
        setStatus($scope, Status.Waiting);
        $http.post(getQuizStartURL(), { time: Date.now() })
            .success(function(data, status) {
                setStatus($scope, Status.Quiz);
            })
            .error(function(data, status) {
                serverError($scope, data, status, "quizstart");
            })
        return;
    }

    // SEND: Stop Quiz
    $scope.quizStart = function() {
        setStatus($scope, Status.Waiting);
        $http.post(getQuizStopURL(), { time: Date.now() })
            .success(function(data, status) {
                setStatus($scope, Status.Off);
            })
            .error(function(data, status) {
                serverError($scope, data, status, "quizstop");
            })
        return;
    }
}

var click = angular.module('click', []);
click.controller('clickCtrl', clickCtrl);
