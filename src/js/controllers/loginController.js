// JavaScript Document
app.controller('loginState', function(login, $scope, $state, formInputValidate, $cookies){
if($cookies.get('accessToken') != undefined){
		$state.go('interface');
	};
$scope.loginMain = function(){
	var errors = formInputValidate($scope.user);
	if(errors.num == 0){
            login($scope.user).then(function(response){
                $state.go('profile');
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
        if(input != undefined){
            var errs = formInputValidate(obj);
            if(errs.num > 0){
                $scope.errors[field] = errs[field];
                console.log(JSON.stringify(errs[field]));
                //$scope.$apply();
            }    
        }
};
});