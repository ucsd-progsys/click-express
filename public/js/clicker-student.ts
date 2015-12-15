
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

function studentClickCtrl($scope, $uibModal, $location, $timeout) {

    // INIT
    $scope.label = "(none)";
    setStatus($scope, t.Status.Off);
    let converter = new showdown.Converter();

    $scope.choices = [
        { id: 0, text: 'A', class: "btn-primary" },
        { id: 1, text: 'B', class: "btn-success" },
        { id: 2, text: 'C', class: "btn-info"    },
        { id: 3, text: 'D', class: "btn-warning" },
        { id: 4, text: 'E', class: "btn-danger"  }
    ];

    $scope.counter = { cnt: 0 };
    $scope.countdown = function() {
        $timeout(function() {
            $scope.counter.cnt--;
            $scope.countdown();
        }, 1000 /* miliseconds */);
    };
   
    $scope.response = { rsp: ERROR_RESPONCE };

    socket.on(QUIZ_BCAST, (quiz: t.QuizPost) => {
        let modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'myModalContent.html',
            controller: 'ModalInstanceCtrl',
            resolve: {
                question: () => converter.makeHtml(quiz.message),
                choices : () => $scope.choices,
                counter : () => $scope.counter,
                response: () => $scope.response                
            },
            backdrop: 'static',
            keyboard: false
        });

        modalInstance.result.then(
            (answer: string) => {
                // return the selection through the socket
                socket.emit(QUIZ_ANS, {
                    quizId: quiz.id,
                    userId: userName,
                    answer: answer,
                    time: new Date()
                });
            },
            () => { console.log('Question dismissed at: ' + new Date()) }
        );
        console.log(quiz.time);
        $scope.counter.cnt = quiz.time;
        $scope.countdown();       

    });
}

function modalInstanceCtrl($scope, $uibModalInstance, question, choices, counter, response) {
    $scope.quiz     = { val: question };
    $scope.choices  = { val: choices };
    $scope.counter  = { val: counter };
    $scope.response = { val: ERROR_RESPONCE };
    $scope.ok       = () => { $uibModalInstance.close($scope.response.rsp); };
    $scope.cancel   = () => { $uibModalInstance.dismiss('cancel'); }
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
