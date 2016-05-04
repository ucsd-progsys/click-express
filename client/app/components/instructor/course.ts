
import * as t             from 'types';

import * as url           from '../../shared/url';
import * as _             from 'underscore';

export function courseCtrl($scope, $http: angular.IHttpService, $routeParams) {
    $scope.quizzes = [];
    
    let course = 'CSE130';
    
    console.log('course is', $routeParams.courseId);    
    
    let URL = url.getServerURL() + '/course/' + course + '/questions';
    console.log(URL);
    
    $http.get(URL).success((data: string) => {
        
        let quizzes: t.IQuiz[] = _.pairs(JSON.parse(data)).map(kv => kv[1]);                
        $scope.quizzes = quizzes;
    });
}



    
// let course = getCurrentURL().split('/').reverse()[0];        
// let namespacePath = url.getServerURL() + '/' + course;    
// let socket = io(namespacePath);

// console.log('Connecting on', namespacePath);

// socketService.registerSocket(socket);

