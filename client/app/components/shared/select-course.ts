
import * as url           from '../../shared/url';
import * as _             from 'underscore';
import * as t             from 'types';
import {IClickerService}  from '../../services/clicker'

interface ISelectCourseScope extends angular.IScope {
    courses: t.ICourse[];
    setCourse(i: number): void;    
}

export function selectCourseCtrl($scope: ISelectCourseScope, $location: angular.ILocationService, $http: angular.IHttpService, clickerService: IClickerService) {
    $scope.courses = [];    
    $http.get(url.getServerURL() + '/courses').success((data: string) => {        
        $scope.courses = _.pairs(JSON.parse(data)).map(kv => kv[1]);
    });
    $scope.setCourse = function(i: number) {
        let courseId = $scope.courses[i].name;
        clickerService.course = courseId;           // update the service (point of reference)   
        $location.path('/course/' + courseId);     
    }
}