
/// <reference path='../shared/misc.ts' />
/// <reference path='../shared/url.ts' />

function classSelectionCtrl($scope, $http) {
    
    console.log('asking for courselist');
    
    $http.get('/courselist').success((data, status, headers, config) => {
        let courseList = JSON.parse(data)
        console.log(courseList);
        $scope.courseList = courseList;
    });
        
}

click.controller('classSelectionCtrl', classSelectionCtrl);
