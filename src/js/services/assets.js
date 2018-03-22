app.service('assets', function($cookies, $http, $q){
    var token = $cookies.get('accessToken');
    
    var getAsset = function(username, locat){
        var deferred = $q.defer();
        $http({ method: 'GET', url: 'chat/asset/lst', params: { user: username, location: locat }, headers: { 'Authorization': 'Bearer ' + token }}).then(function(response){
            console.log(response)
            if(locat == 'profile'){
                deferred.resolve(response.data[0]);
            } else {
                deferred.resolve(response.data);
            }
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