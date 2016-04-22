
function classSelectionCtrl($scope, $http, $location, $window) {
    
    $http.get('/courselist').success((data, status, headers, config) => {
        let courseList = JSON.parse(data)
        $scope.courseList = courseList;
    });
    
    $scope.selectCourse = function(course: string) {        
        $scope.selectedCourse = course;
        // Redirect to relevant course
        $window.location.href = '/course/' + course;
        // $location.path(course); // this adds hashes ...
    };
        
}

click.controller('classSelectionCtrl', classSelectionCtrl);
