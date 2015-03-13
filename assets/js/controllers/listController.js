todoApp.controller('ListController',['$http','$log','$scope','$routeParams',function($http,$log,$scope,$routeParams){
	// $http , $scope , $log injections
	io.socket.get('/item/additem');
	$scope.$log = $log;

	var listId = $routeParams.id;

	// Fecth already existing items
	$http.get('/list/'+listId)
		.success(function(response_data){

		$scope.itemList = response_data;
	});

	io.socket.on('list',function(obj){
		//Check whether the verb is created or not
		if(obj.verb === 'created'){
			// Add the data to current itemList
			$scope.itemList.push(obj.data);
			// Call $scope.$digest to make the changes in UI
			$scope.$digest();
		}
	});

	io.socket.on('item',function(obj){
		//Check whether the verb is created or not
		if(obj.verb === 'created'){
			// Add the data to current itemList
			$scope.itemList.push(obj.data);
			// Call $scope.$digest to make the changes in UI
			$scope.$digest();
		}
	});

	$scope.addItem = function() {
		io.socket.post('/item/additem', {list: listId, text: $scope.itemText});
	};
}]);
