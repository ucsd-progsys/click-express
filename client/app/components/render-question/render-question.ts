
var debug = false;
var socket = io(); // initSocket();

///////////////////////////////////////////////////////////////////////

function studentClickCtrl($scope, $uibModal, $location, $timeout) {

    $scope.options = [
        { id: 0, text: 'A', class: "btn-primary" },
        { id: 1, text: 'B', class: "btn-success" },
        { id: 2, text: 'C', class: "btn-info"    },
        { id: 3, text: 'D', class: "btn-warning" },
        { id: 4, text: 'E', class: "btn-danger"  }
    ];

    // $scope.counter = { cnt: 0 };
    // $scope.countdown = function() {
    //     $timeout(function() {
    //         $scope.counter.cnt--;
    //         $scope.countdown();
    //     }, 1000 /* miliseconds */);
    // };
   
    $scope.response = { rsp: ERROR_RESPONCE };        

    socket.on(QUIZ_START, (quiz: IQuiz) => {
        
        console.log(quiz.data.description);
        console.log(questionToHtml(quiz.data));
        
        let modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'myModalContent.html',
            controller: 'ModalInstanceCtrl',
            resolve: {
                question: () => questionToHtml(quiz.data),
                options : () => quiz.data.options, // $scope.options,
                // counter : () => $scope.counter,
                response: () => $scope.response                
            },
            backdrop: 'static',
            keyboard: false
        });
        
        $scope.currentModal = modalInstance;

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
        
        // $scope.counter.cnt = quiz.time;
        // $scope.countdown();       

    });
    
    // If instructor calls stop -> dismiss the modal instance
    socket.on(QUIZ_STOP, (data: any) => {
        console.log("dismiss modal");
        if ($scope.currentModal) 
            $scope.currentModal.dismiss('cancel');
    });
    
}

function modalInstanceCtrl($scope, $uibModalInstance, question, options, /*counter, */ response) {
    $scope.quiz     = { val: question };
    $scope.options  = { val: options };
    // $scope.counter  = { val: counter };
    $scope.response = { val: ERROR_RESPONCE };
    $scope.ok       = () => { $uibModalInstance.close($scope.response.rsp); };
    $scope.cancel   = () => { $uibModalInstance.dismiss('cancel'); }
};

click.controller('studentClickCtrl', studentClickCtrl);
click.controller('ModalInstanceCtrl', modalInstanceCtrl);
