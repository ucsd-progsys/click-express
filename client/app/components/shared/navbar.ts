
import {IClickerService}  from '../../services/clicker'

export function navbarCtrl($scope, $rootScope, $location: angular.ILocationService, clickerService: IClickerService) {
    $scope.courseHome = () => $location.path(['course', clickerService.getCourse()].join('/'));    
    $scope.getCourse  = () => clickerService.getCourse();
}
