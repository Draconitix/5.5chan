app.factory('login', ['$resource', function($http, $q, $cookies){
    var main = function(user){
        var deferred = $q.defer();
        $http({method: "POST", url: "chat/user/login", data: user}).then(function(){
            
        }, function(err){
            deferred.reject(err);
        });
    };
    return main;
}]);