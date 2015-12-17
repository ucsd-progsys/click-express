
var debug = false;
var socket = io(); // initSocket();

function instructorClickCtrl($scope, $http, $location, $timeout) {

    // INIT
    $scope.label = "(none)";
    // setStatus($scope, t.Status.Off);
    $scope.testInProgress = false;

    // Select from sample questions
    $scope.questionPool = [];
    $scope.selectedQuestion = undefined;
    $scope.textarea = "";

    // // Select time
    // $scope.times = [15, 30, 60];
    // $scope.selectedTime = $scope.times[2];  // default

    // Create Quiz
    // http://mrngoitall.net/blog/2013/10/02/adding-form-fields-dynamically-in-angularjs/
    let charFromInt = (n) => String.fromCharCode(65 + n);

    // Load existing question
	$scope.updateQuestion = () => {
        let newQuestion: QuizContent = JSON.parse($scope.selectedQuestion);
        $scope.textarea = newQuestion.description;
        // Remove all existing choices
        $scope.choices = [];
        // Add the new ones
        newQuestion.options.forEach(v => {
            $scope.addNewChoice(v.index, v.text);
        });
    }

    // New Post Form
    $scope.choices = [];

    // The default values are for when the button is used
    $scope.addNewChoice = (idx = charFromInt($scope.choices.length), txt = "") => {
        let newChoice: Option = {
            index: idx,
            text : txt
        };
        $scope.choices.push(newChoice);
    };

    $scope.removeLastChoice = () => {
        $scope.choices.pop();
    };

    // Preview
    $scope.preview = () => fullQuestionToHtml($scope.textarea, $scope.choices);

    // Running the quiz
    $scope.counter = 0;
    $scope.quizInProgress = false;

    function resetCounter() {
        $scope.counter = 0;
    }

    function makeQuiz(text: string, options: Options): QuizContent {
        return {
            courseId   : "TODO-courseId",
            description: text,
            options    : options,
            correct    : "TODO-correct",
            author     : "TODO-author",
            startTime  : new Date()
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
        let msg = $scope.textarea;
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
