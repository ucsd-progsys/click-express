(function (Message) {
    Message[Message["QuizStart"] = 0] = "QuizStart";
    Message[Message["QuizStop"] = 1] = "QuizStop";
    Message[Message["QuizAck"] = 2] = "QuizAck";
    Message[Message["UserExists"] = 3] = "UserExists";
    Message[Message["ClickFail"] = 4] = "ClickFail";
    Message[Message["ClickOk"] = 5] = "ClickOk";
})(exports.Message || (exports.Message = {}));
var Message = exports.Message;
(function (Status) {
    Status[Status["Off"] = 0] = "Off";
    Status[Status["Quiz"] = 1] = "Quiz";
    Status[Status["Clicked"] = 2] = "Clicked";
})(exports.Status || (exports.Status = {}));
var Status = exports.Status;
var choices = { 1: 'A', 2: 'B', 3: 'C', 4: 'D', 5: 'E' };
var socket = io();
function setStatus($scope, s) {
    $scope.status = s;
    $scope.isClicked = (s === Status.Clicked);
    $scope.isOff = (s === Status.Off);
}
function setQuiz($scope, msg) {
    switch (msg.kind) {
        case Message.QuizStart:
            setStatus($scope, Status.Quiz);
            $scope.quiz = "ON: " + msg.data;
            break;
        case Message.QuizStop:
            setStatus($scope, Status.Off);
            $scope.quiz = "OFF";
            break;
        default:
            break;
    }
}
function getClickURL() {
    return serverURL + "/click";
}
function clickCtrl($scope, $http, $location) {
    $scope.statusPending =
        $scope.label = "(none)";
    socket.on('message', function (msg) {
        setQuiz($scope, msg);
    });
    $scope.clickChoose = function (n) {
        var cn = choices[n];
        $scope.label = cn + "(pending)";
        setStatus($scope, Status.Clicked);
        $http.post(getClickURL(), { choice: n })
            .success(function (data, status) {
            setStatus($scope, Status.Quiz);
            $scope.label = cn;
        })
            .error(function (data, status) {
            $scope.label = "yikes server error!";
            var msg = (data || "Request failed") + status;
            alert(msg);
        });
    };
}
var click = angular.module('click', []);
click.controller('clickCtrl', clickCtrl);
