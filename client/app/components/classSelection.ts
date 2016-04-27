

 interface IClassSelectorScope extends angular.IScope {
    courseList: string[];
    selectedCourse: string;
}

export class ClassSelectionCtrl {
        
    static $inject = ['$scope', '$http', '$window'];    
    constructor(private $scope: IClassSelectorScope, $http: angular.IHttpService, private $window: angular.IWindowService) {
        $http.get('/courselist').success((data: string) => {
            let courseList = JSON.parse(data)
            this.$scope.courseList = courseList;
        });
    }

    selectCourse(course: string) {
        this.$scope.selectedCourse = course;
        // Redirect to relevant course
        this.$window.location.href = '/course/' + course;
    };

}

