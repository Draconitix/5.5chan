app.controller('profileState', function($scope, $cookies, jwtHelper, $state, assets, ngDialog, profile, formInputValidate){
	// Check if user is logged in and redirect to login if not.
    if($cookies.get('accessToken') == undefined){
        $state.go('login');
    }
    var token = $cookies.get('accessToken');
    
    // Scope vars for user data and profile img.
	$scope.user = jwtHelper.decodeToken(token);
	$scope.eUser = angular.copy($scope.user);
    $scope.userImgUri = '';
    $scope.imgUriFolder = '';
    $scope.imgType = '';
    $scope.editing = false;
    $scope.errors = {};
    
    // Profile editng 
    
    $scope.toggleEdit = function(){
        if($scope.editing == false){
            $scope.editing = true;
        } else {
            $scope.editing = false;
        }
    }
	
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
    
    assets.get($scope.user.username, 'profile').then(function(response){
        if(response.thumb == true){
            if(response.cropped == true){
                $scope.userImgUri = response.uri + 'cropped.png';     
            } else {
                $scope.userImgUri = response.uri + 'default.' + response.type; 
            }
            
            $scope.imgUriFolder = response.uri;
            $scope.imgType = response.type;
            $scope.cropped = {
                source: response.uri + 'scaled.' + response.type
            };
            console.log(response);
        } else {
            $scope.userImgUri = response.uri + 'original.' + response.type;
        }
    }, function(err){
        console.log(err);
    })
})