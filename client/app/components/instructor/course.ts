
import * as t             from 'types';

import * as url           from '../../shared/url';
import * as _             from 'underscore';

interface ICourseScope extends angular.IScope {
    quizzes: t.IQuiz[];
    courseId: t.CourseId;
    selectQuiz(i: number): void;
    createQuiz(): void;    
}

export function courseCtrl($scope: ICourseScope, $location: angular.ILocationService, $http: angular.IHttpService, $routeParams) {
    let courseId = $routeParams.courseId;
    let quizzesURL = url.getServerURL() + '/course/' + courseId + '/quizzes';

    $scope.quizzes = [];
    $scope.courseId = courseId;

    $http.get(quizzesURL).success((data: string) => {
        let quizzes: t.IQuiz[] = _.pairs(JSON.parse(data)).map(kv => kv[1]);
        $scope.quizzes = quizzes;
    });

    $scope.selectQuiz = function(i: number) {
        let quizId = $scope.quizzes[i]._id;
        $location.path(['course', courseId, 'quiz', quizId].join('/'));
    }
    
    $scope.createQuiz = function() {
        $location.path(['course', courseId, 'new'].join('/'));
    }
}


// let course = getCurrentURL().split('/').reverse()[0];
// let namespacePath = url.getServerURL() + '/' + course;
// let socket = io(namespacePath);

// console.log('Connecting on', namespacePath);

// socketService.registerSocket(socket);

