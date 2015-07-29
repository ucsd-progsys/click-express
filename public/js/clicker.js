var choices = { 1: 'A', 2: 'B', 3: 'C', 4: 'D', 5: 'E' };
function clickCtrl($scope, $http, $location) {
    $scope.label = "(none)";
    $scope.clickChoose = function (n) {
        $scope.label = choices[n];
    };
}
var click = angular.module('click', []);
click.controller('clickCtrl', clickCtrl);
