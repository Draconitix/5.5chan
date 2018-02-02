app.factory('login', ['$http', '$q', '$cookies', function($http, $q, $cookies){
    var main = function(user){
        var deferred = $q.defer();
        $http({method: "POST", url: "chat/user/login", data: user}).then(function(response){
            $cookies.put('accessToken', response);
        }, function(err){
            deferred.reject(err);
        });
    };
    return main;
}]);