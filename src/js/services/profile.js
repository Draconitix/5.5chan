app.service('profile', function($http, $q, $cookies){
	var token = $cookies.get('accessToken');
	var main = function(data){
		var deferred = $q.defer();
		$http({ method: 'POST', url: 'chat/user/edit', data: data, headers: { 'Authorization': 'Bearer ' + token }}).then(function(response){
			$cookies.remove('accessToken');
			$cookies.put('accessToken', response.data.token);
            deferred.resolve(response);
		}, function(err){
			deferred.reject(err);	
		})
		return deferred.promise;
	};	 
	return main;
});