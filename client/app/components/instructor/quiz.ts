
import * as t             from 'types';
import * as url           from '../../shared/url';

import { quizToHtml     } from '../../../../shared/misc';
import { getCurrentURL  } from '../../shared/url';
import { IClickerService } from '../../services/clicker';

export function quizCtrl($scope: any, $http: angular.IHttpService, $location: angular.ILocationService, 
                         $timeout: angular.ITimeoutService, clickerService: IClickerService) {

    let course = getCurrentURL().split('/').reverse()[2];
    let quizId = getCurrentURL().split('/').reverse()[0];

    let quizURL = url.getServerURL() + '/quiz/' + quizId;

    let socket = clickerService.getSocket();
    // console.log('got socket', socket)

    // Counters
    $scope.studentsAnsweredCount        = 0;
    $scope.totalStudentsInRoom          = 0;
    $scope.studentsAnsweredCorrectCount = 0;
    $scope.studentsAnsweredWrongCount   = 0;
    $scope.quizStarted = false;

    // Render quiz
    $http.get(quizURL).success((data: string) => {
        let quiz = JSON.parse(data);
        $scope.quizHtml = quizToHtml(quiz, false);
    });


    $scope.startQuiz = function() {

        $scope.quizStarted = true;

        // Quiz Id is the last part of the current URL
        let activeQuiz: t.IActiveQuiz =  { id: quizId, course: course };
        socket.emit('quiz-start', activeQuiz);
        console.log('sending', activeQuiz);

        // console.log('Issuing GET', getCurrentURL() + '/start');
        // $http.get(getCurrentURL() + '/start').success((data: string) => {
        //     console.log('quiz started');
        // });

        startTimeCounter();
        resetAnswerCounters();
    }

    $scope.stopQuiz = function() {
        $scope.quizStarted = false;
        $http.get(getCurrentURL() + '/stop').success((data: string) => {
            
        });

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
        console.log(url.getDeleteQuizURL(clickerService.getCourse(), quizId));
        $http.get(url.getDeleteQuizURL(clickerService.getCourse(), quizId)).success((data: string) => {
            console.log(data);
            $location.path(['course', clickerService.getCourse()].join('/'));
            // window.location.href = '/course/' + data;
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
