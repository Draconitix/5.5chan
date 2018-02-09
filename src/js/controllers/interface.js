// JavaScript Document
app.controller('interfaceState', function($scope, $state, logout, $cookies){
	if($cookies.get('accessToken') == undefined){
		$state.go('login');
	};
	$scope.posts = [];
	$scope.logout = function(){
		$cookies.remove('accessToken');
		$state.go('login');
	}
});