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


	io.socket.on('listRemoved', function(obj){
		var index = -1;

		// Find index of the removed item
		_.each($scope.listList, function(data, idx) {
			if (_.isEqual(data.id, parseInt(obj.id))) {
				index = idx;
				return;
			}
		});

		// Remove list from the view
		$scope.listList.splice(index, 1);

		// Call $scope.$digest to make the changes in UI
		$scope.$digest();
	});


	io.socket.on('itemRemoved', function(obj){
		var index = -1;
		// Find index of the removed item
		_.each($scope.itemList, function(data, idx) {
			if (_.isEqual(data.id, parseInt(obj.id))) {
				index = idx;
				return;
			}
		});
		// Remove item from the view
		$scope.itemList.splice(index, 1);
		// Call $scope.$digest to make the changes in UI
		$scope.$digest();
	});








	$scope.addList = function() {
		io.socket.post('/list/addlist/', {name: $scope.listName, collaborators: 2});
		$scope.listName = "";
	};

	$scope.removeList = function(id) {
		io.socket.put('/list/remove/' + id);
	};
}]);
