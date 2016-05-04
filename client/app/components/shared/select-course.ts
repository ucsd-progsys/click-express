
import * as url           from '../../shared/url';
import * as _             from 'underscore';

export function selectCourseCtrl($scope, $http: angular.IHttpService) {
    $scope.courses = [];    
    $http.get(url.getServerURL() + '/courses').success((data: string) => {        
        $scope.courses = _.pairs(JSON.parse(data)).map(kv => kv[1]);
    });
}