
var debug = false;
var socket = io(); // initSocket();

function instructorClickCtrl($scope, $http, $location, $timeout) {

    // INIT
    $scope.label = "(none)";
    // setStatus($scope, t.Status.Off);
    $scope.testInProgress = false;

    // Quiz count -- TODO: server should assing IDs
    let quizCount = 0;

    // Select time
    // $scope.times = [15, 30, 60];
    // $scope.selectedTime = $scope.times[2];  // default

    // Create Quiz
    //
    // http://mrngoitall.net/blog/2013/10/02/adding-form-fields-dynamically-in-angularjs/
    //
    let charFromInt = (n) => String.fromCharCode(65 + n);

    $scope.choices = [];

    $scope.addNewChoice = () => {
        let newChoice: Option = {
            index: charFromInt($scope.choices.length),
            text : ""
        };
        $scope.choices.push(newChoice);
    };

    $scope.removeLastChoice = () => {
        $scope.choices.pop();
    };

    // Preview
    $scope.preview = () => questionToHtml($scope.text, $scope.choices);

    // Running the quiz
    $scope.counter = 0;
    $scope.quizInProgress = false;

    function resetCounter() {
        $scope.counter = 0;
    }

    function makeQuiz(text: string, options: Options): QuizContent {
        return {
            courseId: "TODO-courseId",
            descr   : text,
            options : options,
            correct : "TODO-correct",
            author  : "TODO-author"
        };
    }

    function resumeCounter() {
        $timeout(() => {
            if (!$scope.quizInProgress) return;
            $scope.counter++;
            resumeCounter();
        }, 1000 /* miliseconds */);
    };

    $scope.startQuiz = () => {
        // If string is empty, don't do anything
        let msg = $scope.text;
        let options = $scope.choices;
        if (!msg) return;
        let quiz = makeQuiz(msg, $scope.choices);
        socket.emit(QUIZ_START, quiz);
        $scope.quizInProgress = true;
        resetCounter();
        resumeCounter();
    }

    $scope.stopQuiz = () => {
        $scope.quizInProgress = false;
        resetCounter();
        socket.emit(QUIZ_STOP, {});
    }


}

click.controller('instructorClickCtrl', instructorClickCtrl);
