todoApp.controller('ListListController',['$http','$log','$scope',function($http,$log,$scope){
	// $http , $scope , $log injections
	io.socket.get('/list/addlist');

	// Fecth already existing lists
	$http.get('/list')
		.success(function(response_data){

		$scope.listList = response_data;
	});

	io.socket.on('list', function(obj){
		//Check whether the verb is created or not
		if(obj.verb === 'created'){
			// Add the data to current chatList
			$scope.listList.push(obj.data);
			// Call $scope.$digest to make the changes in UI
			$scope.$digest();
		}
	});

	$scope.addList = function() {
		io.socket.post('/list/addlist/', {name: $scope.listName, collaborators: 2});
		$scope.listName = "";
	};
}]);
