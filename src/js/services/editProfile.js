app.service('editProfile', function($http, $q, $cookies){
   var token = $cookies.get('accessToken');
    
   var main = function(userData){
       var deferred = $q.defer();
       $http({ method: 'PUT', url: "chat/user/update", transformRequest: angular.identity, headers: { 'Content-Type': undefined, 'Authorization': 'Bearer ' + token }, data: userData }).then(function(response){
           deferred.resolve(response.data);
           $cookies.put('accessToken', response.data.token);
       }, function(err){
           deferred.reject(err);
       });
       return deferred.promise;
   };
    
   return main;    
});