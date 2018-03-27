app.controller('profileState', function($scope, $cookies, jwtHelper, $state, assets, ngDialog){
    if($cookies.get('accessToken') == undefined){
        $state.go('login');
    }
    var token = $cookies.get('accessToken');
    
    $scope.test = 'Injected String from controller outside directive';
    
    $scope.user = jwtHelper.decodeToken(token);
    
    $scope.userImgUri = '';
    $scope.imgUriFolder = '';
    $scope.imgType = '';
    
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
        /*var h = window.innerHeight - 500;
        var w = window.innerWidth - 800;    
        $scope.cropPopup.position.top = h/2;
        $scope.cropPopup.position.left = w/2;
        if($scope.cropPopup.isShow == false){
            $scope.cropPopup.isShow = true;
        } else {
            $scope.cropPopup.isShow = false; 
        }*/
    }
    
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