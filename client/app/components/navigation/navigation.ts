
function navCtrl($scope, $location, Data) {
    $scope.CommonData = Data;
    
    $scope.onSelectCourse = (course: string) => {
        $scope.CommonData.courseName = course;
    }
}

click.controller('navCtrl', navCtrl);
