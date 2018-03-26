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
    
     
    
    $scope.crop = function(){
        ngDialog.open({ template: 'partials/cropper.html', 
            scope: $scope, 
            width: '80vw', 
            height: '60vh',
            plain: false           
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
            $scope.userImgUri = response.uri + 'default.' + response.type; 
            $scope.imgUriFolder = response.uri;
            $scope.imgType = response.type;
            $scope.cropped = {
                source: response.uri + 'scaled.' + response.type,
                options: {
                    viewport: { width: 400, height: 400 },
                    boundary: { width: 500, height: 500 },
                    showZoomer: true,
                    enableResize: false,
                    enforceOrientation: true
                }
            };
            console.log(response);
        } else {
            $scope.userImgUri = response.uri + 'original.' + response.type;
        }
    }, function(err){
        console.log(err);
    })
})