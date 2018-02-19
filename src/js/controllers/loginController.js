// JavaScript Document
app.controller('loginCon', function(login, $scope, $state, formInputValidate){
if($cookies.get('accessToken') != undefined){
		$state.go('interface');
	};
$scope.loginMain = function(){
	var errors = formInputValidate($scope.user);
	if(errors.num == 0){
            login($scope.user).then(function(response){
                $state.go('interface');
            }, function(error){
                console.log(error);
            });
        } else {
            $scope.errors = errors;
		}
};
$scope.user = {};
$scope.errors = {};
$scope.validate = function(input, field){
        var obj = {};
        obj[field] = input;
        var errs = formInputValidate(obj);
        if(errs.num > 0){
            $scope.errors[field] = errs[field];
        }
};
});