
import { quizToHtml    } from '../../../shared/misc';
import { getCurrentURL } from '../shared/url';


/*
    States: 'quizRunning', 'quizStopped'
*/

export function quizCtrl($scope, $http: angular.IHttpService, $location, $timeout, Data) {

    // Counters
    $scope.studentsAnsweredCount        = 0;
    $scope.totalStudentsInRoom          = 0;
    $scope.studentsAnsweredCorrectCount = 0;
    $scope.studentsAnsweredWrongCount   = 0;

    $scope.quizStarted = false;

    $scope.startQuiz = function() {
        $scope.quizStarted = true;
        startTimeCounter();
        resetAnswerCounters();
    }

    $scope.stopQuiz = function() {
        $scope.quizStarted = false;
    }

    // show correct answer
    $scope.showCorrectAnswer = false;
    function showAnswer() {
        return $scope.showCorrectAnswer;
    }

    function setCorrectChoiceStyle() {
        $scope.choices.forEach((_, i) => { $scope.choiceStyle[i] = {} });
        $scope.choiceStyle[$scope.correctChoice.index] = { 'background-color': '#cdf1c0' };
    }


    $scope.deleteQuiz = function() {
        $http.get(getCurrentURL() + '/delete').success((data: string) => {
            console.log(data);
            window.location.href = '/course/' + data;
        });
    }
    
    
    ////////////////////////////////////////////////////////////////////
    // Running the Quiz ////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////

    // Timer
    function prettyTime(secs: number): string {
        let res = "";
        let div = Math.floor(secs / 60);
        if (div > 0) {
            res += (div + " min(s) ");
        }
        res += ((secs % 60) + " sec(s) ");
        return res;
    }

    $scope.counter = 0;
    function resetTimeCounter() {
        $scope.counter = 0;
    }

    function resumeTimeCounter() {
        $timeout(() => {
            if (!$scope.quizStarted) return;
            $scope.counter++;
            $scope.counterString = prettyTime($scope.counter);
            resumeTimeCounter();
        }, 1000 /* 1 sec */);
    }
    function startTimeCounter() {
        resetTimeCounter();
        resumeTimeCounter();
    }

    // On-line students
    $scope.connectedStudentIds = [];

    // socket.on('CONNECTED_STUDENTS', (data: { connectedStudentIds: string[] }) => {
    //     $scope.totalStudentsInRoom = Object.keys(data.connectedStudentIds).length;
    // });
    
    function resetAnswerCounters() {
        $scope.studentsAnsweredCount        = 0;
        $scope.totalStudentsInRoom          = 0;
        $scope.studentsAnsweredCorrectCount = 0;
        $scope.studentsAnsweredWrongCount   = 0;
    }





}
