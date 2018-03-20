app.service('assets', function($cookies, $http, $q){
    var token = $cookies.get('accessToken');
    
    var getAsset = function(username, locat){
        var deferred = $q.defer();
        $http({ method: 'GET', url: 'chat/asset/lst', params: { user: username, location: locat }, headers: { 'Authorization': 'Bearer ' + token }}).then(function(response){
            deferred.resolve(response.uri);
        }, function(err){
            deferred.reject(err);
        });
        return deferred.promise;
    };
              
    if(token == undefined){
        return null;    
    } else {
        return { get: getAsset }
    }
});