declare var angular:any;

function clickCtrl($scope, $http, $location) {
  $scope.label = "Ziggertypop.";
}

var click = angular.module('click', []);

click.controller('clickCtrl', clickCtrl);
