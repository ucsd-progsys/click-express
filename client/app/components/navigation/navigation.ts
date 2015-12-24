
function navCtrl($scope, $http, $location, Data) {
    $scope.CommonData = Data;
    
    $scope.onSelectCourse = (course: string) => {
        
        // Join the classroom        
        $scope.CommonData.courseName = course;    
        if ($scope.CommonData.socket) {
            console.log('Joining class room');  
            $scope.CommonData.socket.emit(JOIN_CLASSROOM, course);
        }
        else {
            console.log('Socket not set');
        }
        
        // If the instructor controller defines an `updateQuestionPool` 
        // method then get the pool of questions for this class from the 
        // server
        if ($scope.CommonData.updateQuestionPool) {        
            $http.post(getQuestionsURL(), { courseName: course }).success((data, status) => {
                let quizList: IQuiz[] = JSON.parse(data.questionPool);   
                $scope.CommonData.updateQuestionPool(quizList);                  
            }).error((data, status) => {
                serverError($scope, data, status, "click");
            });        
        }
    }
}

click.controller('navCtrl', navCtrl);
