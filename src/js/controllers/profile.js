app.controller('profileState', function($scope, $cookies, jwtHelper, $state, assets){
    if($cookies.get('accessToken') == undefined){
        $state.go('login');
    }
    var token = $cookies.get('accessToken');
    
    $scope.user = jwtHelper.decodeToken(token);
    
    $scope.userImgUri = '';
    
    assets.get($scope.user.username, 'profile').then(function(response){
        if(response.thumb == true){
            $scope.userImgUri = response.uri + 'thumb.' + response.type; 
            console.log(response);
        } else {
            $scope.userImgUri = response.uri + 'original.' + response.type;
        }
    }, function(err){
        console.log(err);
    })
})