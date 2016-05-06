
import * as t             from 'types';

import * as url           from '../../shared/url';
import * as _             from 'underscore';

import { IClickerService } from '../../services/clicker';


interface ICourseScope extends angular.IScope {
    quizzes: t.IQuiz[];
    courseId: t.CourseId;
    selectQuiz(i: number): void;
    createQuiz(): void;    
}

export function courseCtrl($scope: ICourseScope, $location: angular.ILocationService, $http: angular.IHttpService, $routeParams, clickerService: IClickerService) {
    let courseId = $routeParams.courseId;

    // Quizzes
    
    $scope.quizzes = [];
    $scope.courseId = courseId;
    
    let quizzesURL = url.getServerURL() + '/course/' + courseId + '/quizzes';

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
    
    // Socket init
    
    let socketURL = url.getServerURL() + '/course/' + courseId + '/socket';

    // TODO: Check if we're already connected to this socket 

    $http.get(socketURL).success((data: any) => {                       
        console.log('socket inited on server');
        // Now you we can connect to it        
        clickerService.connectSocket(courseId);        
    });
    
}


// let course = getCurrentURL().split('/').reverse()[0];
// let namespacePath = url.getServerURL() + '/' + course;
// let socket = io(namespacePath);

// console.log('Connecting on', namespacePath);

// socketService.registerSocket(socket);

