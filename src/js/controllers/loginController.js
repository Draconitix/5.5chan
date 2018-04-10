// JavaScript Document
app.controller('loginState', function(login, $scope, $state, formInputValidate, $cookies){
if($cookies.get('accessToken') != undefined){
		$state.go('interface');
	};
$scope.loginMain = function(){
	var errors = formInputValidate.check($scope.user);
	if(errors.num == 0){
            login($scope.user).then(function(response){
                $state.go('profile');
            }, function(error){
                $scope.errors.main = "User not found.";
            });
        } else {
            $scope.errors = errors;
		}
};
$scope.user = { username: "", password: "" };
$scope.errors = {};
$scope.validate = function(input, field){
        var obj = {};
        obj[field] = input;
        if(input != undefined){
            var errs = formInputValidate.check(obj);
            if(errs.num > 0){
                $scope.errors[field] = errs[field];
                console.log(JSON.stringify(errs[field]));
                //$scope.$apply();
            } else {
                $scope.errors[field] = "";
            }    
        }
};
});