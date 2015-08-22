declare var serverURL : string;
declare var angular   : any;
declare var io        : any;

////////////////////////////////////////////////////////////////////////
/// COPY-PASTED FROM ../../src/types.ts ////////////////////////////////
////////////////////////////////////////////////////////////////////////

export enum Message {
    QuizStart
  , QuizStop
  , QuizAck
  , UserExists
  , ClickFail
  , ClickOk
  }

export enum Status {
    Off
  , Quiz
  , Clicked
  }

interface SocketEvent {
    kind: Message
  , data: any
}

////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

var choices   = {1 : 'A', 2: 'B', 3: 'C', 4: 'D', 5: 'E'};
var socket    = io();

////////////////////////////////////////////////////////////////////////


function setStatus($scope, s:Status) {
  $scope.status     = s;
  $scope.isClicked  = (s === Status.Clicked);
  $scope.isOff      = (s === Status.Off);
}

function setQuiz($scope, msg:SocketEvent) {
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


////////////////////////////////////////////////////////
function getClickURL(){
  return serverURL + "/click";
}

function clickCtrl($scope, $http, $location) {
  $scope.statusPending =
  $scope.label = "(none)";

  socket.on('message', function(msg){
    setQuiz($scope, msg);
  });

  $scope.clickChoose = function(n){
    var cn       = choices[n];
    $scope.label = cn + "(pending)";
    setStatus($scope, Status.Clicked);

    $http.post(getClickURL(), {choice: n})
         .success(function(data, status) {
            setStatus($scope, Status.Quiz);
            $scope.label = cn;
          })
         .error(function(data, status) {
            $scope.label = "yikes server error!";
            var msg = (data || "Request failed") + status;
            alert(msg);
         });
  }
}

var click = angular.module('click', []);

click.controller('clickCtrl', clickCtrl);
