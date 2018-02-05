app.service('register', ['$http', '$q', '$cookies', function($http, $q, $cookies){
    var main = function(user){
        var deferred = $q.defer();
        $http({method: "POST", url: "chat/user/register", headers: { 'Content-Type': 'multipart/form-data' }, data: user}).then(function(response){
            $cookies.put('accessToken', response);
            deferred.resolve(response);
        }, function(err){
            deferred.reject(err);
        });
    };
    return main;
}]);