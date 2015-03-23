var todoApp = angular.module('todoApp',['ngRoute']);

// configure our routes
todoApp.config(function($routeProvider) {
    $routeProvider

        // route for the home page
        .when('/', {
            templateUrl : 'pages/lists.html',
            controller: 'ListListController'
        })

        // route for the lists
        .when('/lists', {
            templateUrl : 'pages/lists.html',
            controller  : 'ListListController'
        })

        // route for the list page
        .when('/showlist/:id', {
            templateUrl : 'pages/showlist.html',
            controller  : 'ItemController'
        });
});

todoApp.directive('lists', function(){
	return {
		restrict: 'E',
		templateUrl: 'lists.html'
	}
});
