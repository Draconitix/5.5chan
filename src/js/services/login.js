app.service('login', ['$http', '$q', '$cookies', function($http, $q, $cookies){
    var main = function(user){
        var deferred = $q.defer();
        $http({method: "POST", url: "chat/user/login", data: user}).then(function(response){
            $cookies.put('accessToken', response);
            deferred.resolve(response);
        }, function(err){
            deferred.reject(err);
        });
        return deferred.promise;
    };
    return main;
}]);