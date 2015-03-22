todoApp.controller('ItemController',['$http','$log','$scope','$routeParams','$filter',function($http,$log,$scope,$routeParams,$filter){
	// $http , $scope , $log injections

	$scope.$log = $log;
	var listId = $routeParams.id;

	// Subscribe to changes in this list
	io.socket.get('/list/subscribe/' + listId);

	// Fecth already existing items
	$http.get('/list/' + listId).success(function(response_data){
		$scope.itemList = response_data;
	});

	io.socket.on('updatedItem', function(obj) {
		var itemId = obj.id;
		var newStatus = obj.finished;

		var changedItem = $filter('filter')($scope.itemList, {id: itemId})[0];
		changedItem.finished = newStatus;
		$scope.$digest();
	});

	io.socket.on('itemAdded', function(obj){
		// Add the data to current list
		$scope.itemList.push(obj);
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

	$scope.addItem = function() {
		io.socket.post('/item/additem/', {list: listId, text: $scope.itemText});
		$scope.itemText = "";
	};

	$scope.removeItem = function(id) {
		io.socket.put('/item/remove/' + id, {list: listId});
	};

	$scope.changeFinishedStatus = function(id, newStatus) {
		io.socket.put('/item/update/' + id + '/' + newStatus + '/' + listId);
	};

}]);
