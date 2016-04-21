

function historyCtrl($scope, $http) {
	
	$http.get('/history-data').success((data) => {
		$scope.clicks = data;
	});
	
}

click.controller('historyCtrl', historyCtrl);


