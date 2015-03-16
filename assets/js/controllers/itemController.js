todoApp.controller('ItemController',['$http','$log','$scope','$routeParams','$filter',function($http,$log,$scope,$routeParams,$filter){
	// $http , $scope , $log injections

	$scope.$log = $log;
	var listId = $routeParams.id;

	io.socket.get('/list/subscribe/' + listId);

	// Fecth already existing items
	$http.get('/list/' + listId)
		.success(function(response_data){

		$scope.itemList = response_data;
	});

	io.socket.on('updatedItem', function(obj) {
		var itemId = obj.id;
		var newStatus = obj.finished;

		var changedItem = $filter('filter')($scope.itemList.items, {id: itemId})[0];
		changedItem.finished = newStatus;
		$scope.$digest();
	});

	io.socket.on('itemAdded', function(obj){
		// Add the data to current list
		$scope.itemList.items.push(obj);
		// Call $scope.$digest to make the changes in UI
		$scope.$digest();
	});

	$scope.addItem = function() {
		io.socket.post('/item/additem/', {list: listId, text: $scope.itemText});
		$scope.itemText = "";
	};

	$scope.changeFinishedStatus = function(id, newStatus) {
		io.socket.put('/item/' + id, {finished: newStatus, list: listId});
	}

}]);
