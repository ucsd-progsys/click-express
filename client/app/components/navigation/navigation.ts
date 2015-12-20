
function navCtrl($scope, $location, Data) {
    $scope.CommonData = Data;
    
    $scope.onSelectCourse = (course: string) => {
        $scope.CommonData.courseName = course;              
        if ($scope.CommonData.socket) {  
            $scope.CommonData.socket.emit('join class', course);
        }
        else {
            console.log('Socket not set');
        }        
    }
}

click.controller('navCtrl', navCtrl);
