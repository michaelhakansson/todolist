todoApp.controller('ListListController',['$http','$log','$scope',function($http,$log,$scope){
	// $http , $scope , $log injections
	io.socket.get('/lists/subscribe');
	$scope.$log = $log;

	// Fecth already existing lists
	$http.get('/list')
		.success(function(response_data){

		$scope.listList = response_data;
	});

	io.socket.on('listAdded', function(obj){
		// Add the data to current chatList
		$scope.listList.push(obj);
		// Call $scope.$digest to make the changes in UI
		$scope.$digest();
	});

	$scope.addList = function() {
		io.socket.post('/list/addlist/', {name: $scope.listName, collaborators: 2});
		$scope.listName = "";
	};
}]);
