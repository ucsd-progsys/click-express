
var debug = false;
var socket = io(); // initSocket();

function instructorClickCtrl($scope, $http, $location) {        
        
    // INIT
    $scope.label = "(none)";
    // setStatus($scope, t.Status.Off);
    
    let converter = new showdown.Converter();
    
    
    // Instructor    
    // Quiz count 
    let quizCount = 0;
  
    // SUBMIT: post question
    $scope.submit = () => {
        if ($scope.text) {
            let quiz = makeQuiz($scope.text);
            socket.emit(QUIZ_CREATE, quiz);
        }
    }

    $scope.preview = () => converter.makeHtml($scope.text);

    function makeQuiz(text: string): t.QuizPost {
        return {
            id: quizCount++,
            name: userName,
            message: text
        };
    }
}

click.controller('instructorClickCtrl', instructorClickCtrl);


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
    