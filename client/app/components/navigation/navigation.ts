
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
        
        $http.post(getQuestionsURL(), { courseName: course })
             .success((data, status) => {
                 if ($scope.CommonData.updateQuestionPool) {
                     $scope.CommonData.updateQuestionPool(JSON.parse(data.questionPool));
                 } 
                 else {
                     console.log('updateQuestionPool not set!!!');
                 }
             })
             .error((data, status) => {
                 serverError($scope, data, status, "click");
             });        
    }
}

click.controller('navCtrl', navCtrl);
