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
    $scope.isWaiting = (s === 2);
    $scope.isOff = (s === 0);
}
function setQuiz($scope, msg) {
    switch (msg.kind) {
        case 0:
            setStatus($scope, 1);
            $scope.quiz = "ON: " + msg.info;
            break;
        case 1:
            setStatus($scope, 0);
            $scope.quiz = "OFF";
            break;
        default:
            break;
    }
}
function serverError($scope, data, status, e) {
    var s = "Request failed: " + e;
    $scope.label = s;
    var msg = (data || s) + status;
    alert(msg);
}
function clickCtrl($scope, $http, $location) {
    $scope.label = "(none)";
    setStatus($scope, 0);
    socket.on('message', function (msg) {
        $scope.$apply(function () {
            setQuiz($scope, msg);
        });
    });
    $scope.clickChoose = function (n) {
        var cn = choices[n];
        $scope.label = cn + "(pending)";
        setStatus($scope, 2);
        $http.post(getClickURL(), { choice: n })
            .success(function (data, status) {
            setStatus($scope, 1);
            $scope.label = cn;
        })
            .error(function (data, status) {
            serverError($scope, data, status, "click");
        });
    };
    $scope.quizStart = function () {
        setStatus($scope, 2);
        $http.post(getQuizStartURL(), { time: Date.now() })
            .success(function (data, status) {
            setStatus($scope, 1);
        })
            .error(function (data, status) {
            serverError($scope, data, status, "quizstart");
        });
        return;
    };
    $scope.quizStart = function () {
        setStatus($scope, 2);
        $http.post(getQuizStopURL(), { time: Date.now() })
            .success(function (data, status) {
            setStatus($scope, 0);
        })
            .error(function (data, status) {
            serverError($scope, data, status, "quizstop");
        });
        return;
    };
}
var click = angular.module('click', []);
click.controller('clickCtrl', clickCtrl);
