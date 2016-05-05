
import {IClickerService}  from '../../services/clicker'

export function navbarCtrl($scope, $rootScope, clickerService: IClickerService) {
    // expose the service to the navbar
    $scope.service = clickerService;
}