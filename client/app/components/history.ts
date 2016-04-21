
var App = require('../clicker.app');

function historyCtrl($scope, $http) {
	
	$http.get('/history-data').success((data) => {
		$scope.clicks = data;
	});
	
}

App.click.controller('historyCtrl', historyCtrl);


