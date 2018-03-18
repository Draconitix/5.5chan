app.controller('profileState', function($scope, $cookies, jwtHelper,$state){
    if($cookies.get('accessToken') == undefined){
        $state.go('login');
    }
    var token = $cookies.get('accessToken');
    $scope.user = jwtHelper.decodeToken(token);
    
})