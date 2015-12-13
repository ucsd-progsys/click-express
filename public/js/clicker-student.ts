
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

///////////////////////////////////////////////////////////////////////

function studentClickCtrl($scope, $uibModal, $location) {

    // INIT
    $scope.label = "(none)";
    setStatus($scope, t.Status.Off);

    let userName = "DEFAULT_USER";      // TODO     
    
    socket.on(QUIZ_BCAST, (msg: t.QuizPost) => {
        // console.log(QUIZ_BCAST + ' from ' + msg.name + ' message: ' + msg.message);        
        // angular.element(document.getElementById('space-for-questions')).append(formatQuiz(markdown.toHTML(msg.message)));
  
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'myModalContent.html',
            controller: 'ModalInstanceCtrl',
            resolve: {
                question: msg.message,
                items: function() {
                    return $scope.items;
                }
            },
            backdrop: 'static',
            keyboard: false
        });

        modalInstance.result.then(function(selectedItem) {
            $scope.selected = selectedItem;
        }, function() {
            console.log('Modal dismissed at: ' + new Date());
        });
    });
}

function modalInstanceCtrl($scope, $uibModalInstance, items) {
    $scope.items = items;
    $scope.selected = {
        item: $scope.items[0]
    };
    $scope.ok = function() {
        $uibModalInstance.close($scope.selected.item);
    };
    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };
};


click.controller('studentClickCtrl', studentClickCtrl);
click.controller('ModalInstanceCtrl', modalInstanceCtrl); 

/////////////////////////////////////////////////////////////////////////////


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

    // RECV: quiz notifications (over socket)
    // socket.on('message', (msg) => $scope.$apply(() => setQuiz($scope, msg)));        
    

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
    