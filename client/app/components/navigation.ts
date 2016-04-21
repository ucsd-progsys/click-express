
/// <reference path='../typings/tsd.d.ts' />
/// <reference path='../../../typings/app/types.d.ts' />
/// <reference path='../../../lib/misc.ts' />
/// <reference path='../../../lib/url.ts' />

import * as t from 'types';

declare let click   : any;

function navCtrl($scope, $http, $location, Data) {
    $scope.CommonData = Data;
    
    $scope.onSelectCourse = (course: string) => {
        
        // Join the classroom        
        $scope.CommonData.courseName = course;    
        if ($scope.CommonData.socket) {
            console.log('Joining class room');  
            $scope.CommonData.socket.emit('JOIN_CLASSROOM', course);
        }
        else {
            console.log('Socket not set');
        }
        
        // If the instructor controller defines an `updateQuestionPool` 
        // method then get the pool of questions for this class from the 
        // server
        if ($scope.CommonData.updateQuestionPool) {        
            $http.post(Url.getQuestionsURL(), { courseName: course }).success((data, status) => {
                let quizList: t.IQuiz[] = JSON.parse(data.questionPool);   
                $scope.CommonData.updateQuestionPool(quizList);                  
            }).error((data, status) => {
                Misc.serverError($scope, data, status, "click");
            });        
        }
    }
}

click.controller('navCtrl', navCtrl);
