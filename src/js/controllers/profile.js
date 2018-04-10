app.controller('profileState', function($scope, $cookies, jwtHelper, $state, assets, ngDialog, profile, formInputValidate, profile){
	// Check if user is logged in and redirect to login if not.
    if($cookies.get('accessToken') == undefined){
        $state.go('login');
    }
    var token = $cookies.get('accessToken');
    
    // Scope vars for user data and profile img.
	$scope.user = jwtHelper.decodeToken(token);
	$scope.eUser = { username: $scope.user.username, email: $scope.user.email, desc: $scope.user.desc };
    $scope.userImgUri = '';
    $scope.imgUriFolder = '';
    $scope.imgType = '';
    $scope.editing = false;
    $scope.errors = {};
    
    // Profile img edit
    $scope.currentFile = "";
    $scope.changeFile = function(files){
        $scope.currentFile = files[0];
        $scope.$apply();
    }
    
    // Profile editing 
    
    $scope.toggleEdit = function(){
        if($scope.editing == false){
            $scope.editing = true;
        } else {
            $scope.editing = false;
        }
    }
    var formData = new FormData();
    var formDataSetup = function(){
        formData.append('username', $scope.eUser.username)
        formData.append('email', $scope.eUser.email)
        formData.append('desc', $scope.eUser.desc)
        if($scope.currentFile != ""){ formData.append('profile', $scope.currentFile) }
    };
    
    $scope.put = function(){
        var errors = formInputValidate.check($scope.eUser);
        console.log(errors);
        if(/(\.jpg|\.JPG|\.JPEG|\.jpeg|\.png|\.PNG|\.gif|\.GIF)$/g.test($scope.currentFile.name) == false && $scope.currentFile != ""){
            errors.num += 1;
            $scope.errors.profile = 'Profile image must be a image file';
            console.log('file error')
        }
        if(errors.num == 0){
            formDataSetup();
            profile.edit(formData).then(function(response){
                $state.go('profile');
                refresh();
            }, function(error){
                console.log(error);
            });
        } else {
            $scope.errors = errors;
            if(/(\.jpg|\.JPG|\.JPEG|\.jpeg|\.png|\.PNG|\.gif|\.GIF)$/g.test($scope.currentFile.name) == false && $scope.currentFile != "") 
            {$scope.errors.profile = 'Profile image must be a image file';}
        }
    };
    
	
	// Cropping functions for editing profile img
    $scope.saveCrop = function(){
		assets.crop($scope.user.username ,$scope.cropped.image).then(function(response){
            console.log(response);
        }, function(err){
            console.log(err);
        });
		ngDialog.closeAll();
		$scope.userImgUri = $scope.cropped.image;
	};
    
    $scope.del = function(){
        profile.remove().then(function(res){
            console.log(res);
            $state.go('login');
        });
    };
	
    $scope.crop = function(){
        ngDialog.open({ template: 'partials/cropper.html', 
            scope: $scope, 
            width: '100vw', 
            height: '70vh',
            showClose: false           
        });
    }
	
	// Form validate function for editing profile
	$scope.validate = function(input, field){
        var obj = {};
        obj[field] = input;
        if(input != undefined){
            var errs = formInputValidate.check(obj);
            if(errs.num > 0){
                $scope.errors[field] = errs[field];
                console.log(JSON.stringify(errs[field]));
                //$scope.$apply();
            } else if(field === "username" || field === "email") {
                if(input != $scope.user.username && input != $scope.user.email){
                    formInputValidate.taken(field, input).then(function(res){
                        if(res.length != 0){
                            var capLetter = field.charAt(0).toUpperCase(), restStr = field.split(field[0]), fullStr = capLetter + restStr[1] + ' is already taken.'  
                            $scope.errors[field] = fullStr;
                        } else {
                           $scope.errors[field] = ""; 
                        }
                    })  
                }
            } else {
                $scope.errors[field] = "";
            }    
        }
     };
    
    // Get profile image
    
    assets.get($scope.user.username, 'profile').then(function(response){
        if(response.thumb == true){
            if(response.cropped == true){
                $scope.userImgUri = response.uri + 'cropped.png';
                //$scope.$apply();
            } else {
                $scope.userImgUri = response.uri + 'default.' + response.type;
                //$scope.$apply();
            }
            
            $scope.imgUriFolder = response.uri;
            $scope.imgType = response.type;
            $scope.cropped = {
                source: response.uri + 'scaled.' + response.type
            };
            console.log(response);
        } else {
            $scope.userImgUri = response.uri + 'original.' + response.type;
            //$scope.$apply();
        }
    }, function(err){
        console.log(err);
    })
    
    // Logout
    
    $scope.logout = function(){
        $cookies.remove('accessToken');
        $state.go('login');
    };
    
    // Get new profile data
    
    var refresh = function(){
        token = $cookies.get('accessToken');
        $scope.user = jwtHelper.decodeToken(token);
        $scope.editing = false;
        $scope.currentFile = "";
        formData = new FormData();
        $scope.eUser = { username: $scope.user.username, email: $scope.user.email, desc: $scope.user.desc };
        setTimeout(function(){
              assets.get($scope.user.username, 'profile').then(function(response){
            if(response.thumb == true){
                if(response.cropped == true){
                    $scope.userImgUri = response.uri + 'cropped.png';
                    //$scope.$apply();
                } else {
                    $scope.userImgUri = response.uri + 'default.' + response.type;
                    //$scope.$apply();
                }

                $scope.imgUriFolder = response.uri;
                $scope.imgType = response.type;
                $scope.cropped = {
                    source: response.uri + 'scaled.' + response.type
                };
                console.log(response);
            } else {
                    $scope.userImgUri = response.uri + 'original.' + response.type;
                    //$scope.$apply();
                }
            }, function(err){
                console.log(err);
            })  
        }, 3000)
        
    };
})