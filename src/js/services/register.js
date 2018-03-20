app.service('register', ['$http', '$q', '$cookies', function($http, $q, $cookies){
    var main = function(user){
        var deferred = $q.defer();
        $http({method: "POST", url: "chat/user/register", transformRequest: angular.identity, headers: { 'Content-Type': undefined }, data: user}).then(function(response){
            //console.log(response)
            $cookies.put('accessToken', response.data.token);
            deferred.resolve(response);
        }, function(err){
            deferred.reject(err);
        });
        return deferred.promise;
    };
    return main;
}]);