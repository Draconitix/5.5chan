// I set this controller up because the file uploads are tricky to setup, so to save you from ripping your hair out, I made it for you.

app.controller('registerState', function($scope, $state, register, formInputValidate){
    var formData = new FormData();
    var formDataSetup = function(){
        formData.append('username', $scope.user.username)
        formData.append('password', $scope.user.password)
        formData.append('email', $scope.use.email)
        formData.append('firstname', $scope.user.firstname)
        formData.append('lastname', $scope.user.lastname)
        formData.append('desc', $scope.user.desc)
        if($scope.currentFile != ""){ formData.append('profile', $scope.currentFile) }
    };
    $scope.currentFile = "";
    $scope.user = {};
    $scope.errors = {};
    $scope.changeFile(files){
        $scope.currentFile = files[0];
    }
    $scope.validate = function(input, field){
        var obj = {};
        obj[field] = input;
        var errs = formInputValidate(obj);
        if(errs.num > 0){
            $scope.errors[field] = errs[field];
        }
    };
    $scope.register = function(){
        var errors = formInputValidate($scope.user);
        if(/(\.jpg|\.JPG|\.JPEG|\.jpeg|\.png|\.PNG|\.gif|\.GIF)$/g.test($scope.currentFile.name) == false && $scope.currentFile != ""){
            errors.num = 1;
            $scope.errors.profile = 'Profile image must be a image file';
        }
        if(errors.num == 0){
            formDataSetup();
            register(formData).then(function(response){
                $state.go('profile');
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