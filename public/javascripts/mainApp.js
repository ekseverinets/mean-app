var app = angular.module('mainApp', ['ngRoute', 'ngResource']).run(function($rootScope, $http) {
	$rootScope.authenticated = false;
	$rootScope.current_user = '';
	
	$rootScope.signout = function(){
		$http.get('auth/signout');
		$rootScope.authenticated = false;
		$rootScope.current_user = '';
	};
    
	// D3 block
	var i = 0;
    
	var svg = d3.select('.d3-block').append('svg');
    
	svg.append('rect')
		.on('ontouchstart' in document ? 'touchmove' : 'mousemove', particle);
    
	function particle() {
		var m = d3.mouse(this);
    
		svg.insert('circle', 'rect')
			.attr('cx', m[0])
			.attr('cy', m[1])
			.attr('r', 1e-6)
			.style('stroke', d3.hsl((i = (i + 1) % 360), 1, .5))
			.style('stroke-opacity', 1)
			.transition()
			.duration(2000)
			.ease(Math.sqrt)
			.attr('r', 100)
			.style('stroke-opacity', 1e-6)
			.remove();
    
		d3.event.preventDefault();
	}
	// End D3 block
    
});

app.config(function($routeProvider){
	$routeProvider
		//the timeline display
		.when('/', {
			templateUrl: 'main.html',
			controller: 'mainController'
		})
		//the login display
		.when('/login', {
			templateUrl: 'login.html',
			controller: 'authController'
		})
		//the signup display
		.when('/register', {
			templateUrl: 'register.html',
			controller: 'authController'
		});
});

app.factory('postService', function($resource){
	return $resource('/api/posts/:id');
});

app.controller('mainController', function(postService, $scope, $rootScope){
	$scope.posts = postService.query();
	$scope.newPost = {created_by: '', text: '', created_at: ''};
	
	$scope.post = function() {
		$scope.newPost.created_by = $rootScope.current_user;
		$scope.newPost.created_at = Date.now();
		postService.save($scope.newPost, function(){
			$scope.posts = postService.query();
			$scope.newPost = {created_by: '', text: '', created_at: ''};
		});
	};
});

app.controller('authController', function($scope, $http, $rootScope, $location){
	$scope.user = {username: '', password: ''};
	$scope.error_message = '';

	$scope.login = function(){
		$http.post('/auth/login', $scope.user).success(function(data){
			if(data.state == 'success'){
				$rootScope.authenticated = true;
				$rootScope.current_user = data.user.username;
				$location.path('/');
			}
			else{
				$scope.error_message = data.message;
			}
		});
	};

	$scope.register = function(){
		$http.post('/auth/signup', $scope.user).success(function(data){
			if(data.state == 'success'){
				$rootScope.authenticated = true;
				$rootScope.current_user = data.user.username;
				$location.path('/');
			}
			else{
				$scope.error_message = data.message;
			}
		});
	};
});