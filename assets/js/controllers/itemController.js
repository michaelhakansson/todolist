todoApp.controller('ItemController',['$http','$log','$scope','$routeParams','$filter',function($http,$log,$scope,$routeParams,$filter){
	// $http , $scope , $log injections

	$scope.$log = $log;
	var listId = $routeParams.id;

	io.socket.get('/item/subscribe');
	io.socket.get('/item/additem');

	// io.socket.on('connect', function socketConnected() {
	// 	console.log("This is from the connect: ", this.io.socket);

	// 	io.socket.on('message', function notificationReceivedFromServer ( message ) {
	// 		$log.info(message);
	// 	// e.g. message ===
	// 	// {
	// 	//   data: { name: ‘Roger Rabbit’},
	// 	//   id: 13,
	// 	//   verb: ‘update’
	// 	// }
	// 	});
	// });

	// Fecth already existing items
	$http.get('/list/' + listId)
		.success(function(response_data){

		$scope.itemList = response_data;
	});

	io.socket.on('item', function(obj){
		//Check whether the verb is created or not
		if(obj.verb === 'created' && obj.data.list === parseInt(listId)){
			// Add the data to current chatList
			$scope.itemList.items.push(obj.data);
			// Call $scope.$digest to make the changes in UI
			$scope.$digest();
		}

		if(obj.verb === 'updated' && obj.data.list === parseInt(listId)){
			var itemId = obj.id;
			var newStatus = obj.data.finished;
			var changedItem = $filter('filter')($scope.itemList.items, {id: itemId})[0];
			changedItem.finished = newStatus;
			$scope.$digest();
		}
	});

	$scope.addItem = function() {
		io.socket.post('/item/additem/', {list: listId, text: $scope.itemText});
		$scope.itemText = "";
	};

	$scope.changeFinishedStatus = function(id, newStatus) {
		io.socket.put('/item/' + id, {finished: newStatus, list: listId});
	}

}]);
