import angular from 'angular';
import ngRoute from 'angular-route';
import ngResource from 'angular-resource';

import 'bootstrap/dist/css/bootstrap.css';
import './styles/style.css';


let app = angular.module('mainApp', ['ngRoute', 'ngResource']).run(function ($rootScope, $http) {
	$rootScope.authenticated = false;
	$rootScope.current_user = '';
	
	$rootScope.signout = function () {
		$http.get('auth/signout');
		$rootScope.authenticated = false;
		$rootScope.current_user = '';
		localStorage.clear();
	};

});

app.config(function ($routeProvider) {
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
		})
		.otherwise({
			redirect: '/',
		});
});

app.factory('postService', function ($resource) {
	return $resource('/api/posts/:id');
});

app.controller('mainController', function (postService, $scope, $rootScope, $http) {

	if(localStorage.getItem('user') !== null) {
		var user = localStorage.getItem('user');
		$rootScope.current_user = user;
		$rootScope.authenticated = true;
	}

	$scope.posts = postService.query();
	$scope.newPost = {
		created_by: '',
		text: '',
		created_at: ''
	};

	$scope.post = function () {
		console.log('post');
		$scope.newPost.created_by = $rootScope.current_user;
		$scope.newPost.created_at = Date.now();
		$http.post('/api/posts', $scope.newPost).then((res) => {
				
			$scope.newPost = {
				created_by: '',
				text: '',
				created_at: ''
			};

			console.log($scope.newPost);
		}, (err) => {
			console.log(err);
		});
	};

	// $scope.post = function () {
	// 	console.log('post');
	// 	$scope.newPost.created_by = $rootScope.current_user;
	// 	$scope.newPost.created_at = Date.now();
	// 	postService.save($scope.newPost, function () {
	// 		$scope.posts = postService.query();
	// 		$scope.newPost = {
	// 			created_by: '',
	// 			text: '',
	// 			created_at: ''
	// 		};
	// 	});
	// };
});

app.controller('authController', function ($scope, $http, $rootScope, $location) {
	$scope.user = {
		username: '',
		password: ''
	};
	$scope.error_message = '';

	$scope.login = function () {
		$http.post('/auth/login', $scope.user).then((res) => {
			const data = res.data;
			if (data.state === 'success') {
				$rootScope.authenticated = true;
				$rootScope.current_user = $scope.user.username;
				localStorage.setItem('user', $rootScope.current_user);
				$location.path('/');
			} else {
				$scope.error_message = data.message;
			}
		}, (err) => {
			console.log(err);
		});
	};

	$scope.register = function () {
		$http.post('/auth/signup', $scope.user).then((res) => {
			const data = res.data;
			if (data.state == 'success') {
				$rootScope.authenticated = true;
				$rootScope.current_user = $scope.user.username;
				localStorage.setItem('user', $rootScope.current_user);
				$location.path('/');
			} else {
				$scope.error_message = data.message;
			}
		}, (err) => {
			console.log(err);
		});
	};
});