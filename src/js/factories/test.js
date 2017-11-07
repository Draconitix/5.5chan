app.factory('universal', ['$resource', function($resource){
    return $resource('/gAPI/?q=user');
}]);