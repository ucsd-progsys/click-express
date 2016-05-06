
import * as url           from '../../shared/url';
import * as t             from 'types';

import { IClickerService } from '../../services/clicker';
import { charFromInt
       , questionToHtml } from '../../../../shared/misc';


type HtmlString = string;

interface ICourseScope extends angular.IScope {
    // State
    quizInProgress: boolean;

    quizHtml: HtmlString;
}

export function courseCtrl($scope: ICourseScope, $rootScope, $http: angular.IHttpService, $timeout: angular.ITimeoutService, clickerService: IClickerService) {

    // Init
    console.log('courseCtrl exec')
    // $scope.quizInProgress = false;

    let courseId = clickerService.getCourse();
    let socketURL = url.getServerURL() + '/' + courseId;
    let socket = io.connect(socketURL);

    if (!socket) {
        console.log('Could not connect to socket (namespace)', socketURL);
    }

    socket.on('quiz-start', function(q: t.IQuiz) {

        let quizHtml = questionToHtml(q.description, q.options);
        $scope.quizInProgress = true;
        $scope.quizHtml = quizHtml;
        console.log('quiz-start received');

        // http://stackoverflow.com/a/30545450
        // You need to apply scope changes because Angular doesn't know
        // anything about changes made to model by socket event (it happens
        // from "outside" of Angular digest lifecycle):
        $scope.$apply();

    });

    socket.on('quiz-stop', function(q: t.IQuiz) {
        $scope.quizInProgress = false;
        $scope.quizHtml = '';
        console.log('quiz-stop received')
        $scope.$apply();
    });


    // function makeClick(scope: any, quiz: t.IQuiz, answer: number): t.IClick {
    //     return {
    //         username   : scope.CommonData.username,
    //         quizId     : "", // quiz._id,
    //         choice     : answer,
    //         submitTime : new Date()
    //     }
    // }

}
