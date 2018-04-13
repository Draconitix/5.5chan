app.service('profile', function($http, $q, $cookies){
   var token = $cookies.get('accessToken');
    
   var edit = function(userData){
       var deferred = $q.defer();
       $http({ method: 'PUT', url: "chat/user/update", transformRequest: angular.identity, headers: { 'Content-Type': undefined, 'Authorization': 'Bearer ' + token }, data: userData }).then(function(response){
           deferred.resolve(response.data);
           $cookies.put('accessToken', response.data.token);
       }, function(err){
           deferred.reject(err);
       });
       return deferred.promise;
   };
    
   var remove = function(){
       var deferred = $q.defer();
       $http({ method: "DELETE", url: "chat/user/remove", transformRequest: angular.identity, headers: { 'Authorization': 'Bearer ' + token }}).then(function(res){
         deferred.resolve(res.data);
         $cookies.remove('accessToken');
       }, function(err){
         deferred.reject(err);  
       })
       return deferred.promise;
   };
    
   return { edit: edit, remove: remove};    
});