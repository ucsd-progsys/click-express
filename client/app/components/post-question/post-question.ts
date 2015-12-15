
var debug = false;
var socket = io(); // initSocket();

function instructorClickCtrl($scope, $http, $location, $timeout) {

    // INIT
    $scope.label = "(none)";
    // setStatus($scope, t.Status.Off);
    $scope.testInProgress = false;

    let converter = new showdown.Converter();

    // Quiz count -- TODO: server should assing IDs
    let quizCount = 0;

    // Select time
    $scope.times = [15, 30, 60];
    $scope.selectedTime = $scope.times[2];  // default
    
    $scope.changeTime = () => { };

    $scope.counter = 0;
    $scope.quizInProgress = false;

    function resetCounter() {
        $scope.counter = 0;
    }

    function resumeCounter() {
        $timeout(() => {
            if (!$scope.quizInProgress) return;
            $scope.counter++;
            resumeCounter();
        }, 1000 /* miliseconds */);
    };

    function initQuiz(msg: string) {
        // If string is empty, don't do anything
        if (!msg) return;
        let quiz = makeQuiz(msg);
        socket.emit(QUIZ_START, quiz);
        $scope.quizInProgress = true;
        resetCounter();
        resumeCounter();
    }

    function terminateQuiz() {
        $scope.quizInProgress = false;
        resetCounter();
        socket.emit(QUIZ_STOP, {});        
    }

    function makeQuiz(text: string): t.QuizPost {
        return {
            id: quizCount++,
            name: userName,
            message: text,
            time: $scope.selectedTime
        };
    }

    $scope.startQuiz = () => { initQuiz($scope.text); } 
    $scope.stopQuiz  = () => { terminateQuiz(); } 
    $scope.preview   = () => converter.makeHtml($scope.text);

}

click.controller('instructorClickCtrl', instructorClickCtrl);


/////////////////////////////////////////////////////////////////////////////

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
