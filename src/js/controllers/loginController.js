// JavaScript Document
app.controller('loginCon', function(login, $scope, $state){
$scope.loginMain = function(user){
	login(user);
	$state.go("interface");
};
	$scope.user = {};
});
