app.service('assets', function($cookies, $http, $q){
    var token = $cookies.get('accessToken');
    
    var editProfile = function(data){
        var deferred = $q.defer();
        $http({ method: 'PUT', url: 'chat/asset/update', headers: { 'Authorization': 'Bearer ' + token }, data: data }).then(function(response){
            deferred.resolve(response.data)
        }, function(err){
            deferred.reject(err);
        });
        return deferred.promise;
    };
    
    var getAsset = function(username, locat){
        var deferred = $q.defer();
        if(username.length > 0){
            $http({ method: 'GET', url: 'chat/asset/lst', params: { user: username, location: locat }, headers: { 'Authorization': 'Bearer ' + token }}).then(function(response){
                if(locat == 'profile'){
                    deferred.resolve(response.data[0]);
                } else {
                    deferred.resolve(response.data);
                }
            }, function(err){
                deferred.reject(err);
            });
        } else {
            console.log('no username passed')
            $http({ method: 'GET', url: 'chat/asset/lst', params: { location: locat }, headers: { 'Authorization': 'Bearer ' + token }}).then(function(response){
                deferred.resolve(response.data);
                console.log('test')
        }, function(err){
            deferred.reject(err);
        });
        }
        return deferred.promise;
    };
    
    var create = function(files){
        var deferred = $q.defer();
        console.log(files.get('file'));
        $http({ method: "POST", url: "chat/asset/create", transformRequest: angular.identity, headers: { 'Content-Type': undefined, 'Authorization': 'Bearer ' + token }, data: files }).then(function(response){
            deferred.resolve(response.data);
        }, function(err){
            deferred.reject(err);
        });
        return deferred.promise;
    };
    
    var remove = function(query) {
        var deferred = $q.defer();
        $http({ method: 'DELETE', url: "chat/asset/remove", transformRequest: angular.identity, headers: { 'Content-Type': "application/json;charset=utf-8", 'Authorization': 'Bearer ' + token  }, data: query }).then(function(res){
            deferred.resolve(res.data);
        }, function(err){
            deferred.reject(err);
        });
        return deferred.promise;
    };
    
    var crop = function(username, data){
        var deferred = $q.defer();
        $http({ method: 'POST', url: 'chat/asset/crop', data: { user: username, data: data }, headers: { 'Authorization': 'Bearer ' + token }}).then(function(response){
            console.log(response)
            deferred.resolve(response.data);
        }, function(err){
            deferred.reject(err);
        });
        return deferred.promise;
    }
              
    if(token == undefined){
        return null;    
    } else {
        return { get: getAsset, crop: crop, create: create, remove: remove, editProfile: editProfile }
    }
});