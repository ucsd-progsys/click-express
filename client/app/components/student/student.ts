declare var userName: string;
var debug = false;
var socket = io({ query: 'userName=' + userName });

///////////////////////////////////////////////////////////////////////

function makeClick(scope: any, quiz: IQuiz, answer: number): IClick {
    return {
        username   : scope.CommonData.userName,
        quizId     : quiz._id,
        choice     : answer,
        submitTime : new Date()
    }
}

function studentClickCtrl($scope, $uibModal, $location, $timeout, Data) {

    // Populate CommonData
    $scope.CommonData = Data;
    $scope.CommonData.socket = socket;
    $scope.CommonData.userName = userName;

    // Auxiliary functions
    $scope.charFromInt = charFromInt;
    $scope.tof = <A>(x: A) => typeof x;

    // $scope.counter = { cnt: 0 };
    // $scope.countdown = function() {
    //     $timeout(function() {
    //         $scope.counter.cnt--;
    //         $scope.countdown();
    //     }, 1000 /* miliseconds */);
    // };

    $scope.response = { rsp: ERROR_RESPONCE };

    socket.on(QUIZ_START, (quiz: IMaskedQuiz) => {
        // console.log(quiz);
        let modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'myModalContent.html',
            controller: 'ModalInstanceCtrl',
            resolve: {
                question: () => quizDescriptionToHtml(quiz),
                options : () => quiz.options,
                // counter : () => $scope.counter,
                response: () => $scope.response
            },
            backdrop: 'static',
            keyboard: false
        });

        $scope.currentModal = modalInstance;

        modalInstance.result.then(
            (answer: number) => {
                let click = makeClick($scope, quiz, answer);
                console.log(click);
                // return the selection through the socket
                socket.emit(QUIZ_ANSWER, click);
            },
            () => { 
                console.log('Question dismissed at: ' + new Date()) 
            }
        );

        // $scope.counter.cnt = quiz.time;
        // $scope.countdown();

    });

    // If instructor calls stop -> dismiss the modal instance
    socket.on(QUIZ_STOP, (data: any) => {
        if ($scope.currentModal)
            $scope.currentModal.dismiss('cancel');
    });

}

function modalInstanceCtrl($scope, $uibModalInstance, question, options, /*counter, */ response) {
    $scope.quiz     = { val: question };
    $scope.options  = { val: options.map((o, i) => { return { ii: charFromInt(i), text: o } }) };
    // $scope.counter  = { val: counter };
    $scope.response = { val: ERROR_RESPONCE };
    $scope.ok       = () => { $uibModalInstance.close($scope.response.rsp); };
    $scope.cancel   = () => { $uibModalInstance.dismiss('cancel'); }
};

click.controller('studentClickCtrl', studentClickCtrl);
click.controller('ModalInstanceCtrl', modalInstanceCtrl);
