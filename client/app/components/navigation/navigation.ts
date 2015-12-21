
function navCtrl($scope, $http, $location, Data) {
    $scope.CommonData = Data;
    
    $scope.onSelectCourse = (course: string) => {
        $scope.CommonData.courseName = course;              
        if ($scope.CommonData.socket) {  
            $scope.CommonData.socket.emit('join class', course);
        }
        else {
            console.log('Socket not set');
        }
        
        // If the instructor controller defines an `updateQuestionPool` 
        // method then get the pool of questions for this class from the 
        // server
        if ($scope.CommonData.updateQuestionPool) {        
            $http.post(getQuestionsURL(), { courseName: course }).success((data, status) => {
                $scope.CommonData.updateQuestionPool(JSON.parse(data.questionPool));                  
            }).error((data, status) => {
                serverError($scope, data, status, "click");
            });        
        }
    }
}

click.controller('navCtrl', navCtrl);
