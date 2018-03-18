// I set this controller up because the file uploads are tricky to setup, so to save you from ripping your hair out, I made it for you.

app.controller('registerState', function($scope, $state, register, formInputValidate, $cookies){
    //$cookies.remove('accessToken')
    if($cookies.get('accessToken') != undefined){
		$state.go('interface');
	};
    var formData = new FormData();
    var formDataSetup = function(){
        formData.append('username', $scope.user.username)
        formData.append('password', $scope.user.password)
        formData.append('email', $scope.user.email)
        formData.append('desc', $scope.user.desc)
        if($scope.currentFile != ""){ formData.append('profile', $scope.currentFile) }
    };
    $scope.currentFile = "";
    $scope.user = { username: "", password: "", email: "", desc: "" };
    $scope.errors = {};
    $scope.changeFile = function(files){
        $scope.currentFile = files[0];
        $scope.$apply();
    }
    $scope.validate = function(input, field){
        var obj = {};
        obj[field] = input;
        if(input != undefined){
            var errs = formInputValidate(obj);
            if(errs.num > 0){
                $scope.errors[field] = errs[field];
                console.log(JSON.stringify(errs[field]));
                //$scope.$apply();
            } else {
                $scope.errors[field] = "";
            }    
        }
     };
    
    $scope.register = function(){
        var errors = formInputValidate($scope.user);
        if(/(\.jpg|\.JPG|\.JPEG|\.jpeg|\.png|\.PNG|\.gif|\.GIF)$/g.test($scope.currentFile.name) == false && $scope.currentFile != ""){
            errors.num += 1;
            $scope.errors.profile = 'Profile image must be a image file';
        }
        if(errors.num == 0){
            formDataSetup();
            register(formData).then(function(response){
                $state.go('profile');
                $scope.user = { username: "", password: "", email: "", desc: "" };
            }, function(error){
                console.log(error);
            });
        } else {
            $scope.errors = errors;
            if(/(\.jpg|\.JPG|\.JPEG|\.jpeg|\.png|\.PNG|\.gif|\.GIF)$/g.test($scope.currentFile.name) == false && $scope.currentFile != "") 
            {$scope.errors.profile = 'Profile image must be a image file';}
        }
    };
    
    
});