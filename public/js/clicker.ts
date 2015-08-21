declare var serverURL : string;
declare var angular   : any;

var choices = {1 : 'A', 2: 'B', 3: 'C', 4: 'D', 5: 'E'};

////////////////////////////////////////////////////////
enum Status { question, clicked, received };

/*
  question -- click  --> clicked
  clicked  -- ack    --> received
  received -- new qn --> question
*/

function setStatus($scope, s:Status) {
  $scope.status     = s;
  $scope.isquestion = (s == Status.question);
  $scope.isclicked  = (s == Status.clicked);
  $scope.isreceived = (s == Status.received);
}


////////////////////////////////////////////////////////
function getClickURL(){
  return serverURL + "/click";
}

function clickCtrl($scope, $http, $location) {
  $scope.statusPending =
  $scope.label = "(none)";

  $scope.clickChoose = function(n){
    var cn       = choices[n];
    $scope.label = cn + "(pending)";
    setStatus($scope, Status.clicked);

    $http.post(getClickURL(), {choice: n})
         .success(function(data, status) {
            setStatus($scope, Status.received);
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
