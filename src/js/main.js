var app = angular.module('Chan', ['ngResource', 'ui.router', 'ngCookies', 'angular-jwt']);

app.config(function($interpolateProvider) {
  $interpolateProvider.startSymbol('{[{');
  $interpolateProvider.endSymbol('}]}');
});

app.config(['$qProvider', function ($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
}]);

/* app.run(function($http, userLogin, $cookies){
    if($cookies.getObject('userSession') == undefined){
        userLogin.getSession();    
    }
    userLogin.getSession().then(function(data){
        console.log('main' + data);
    }, function(err){
        console.log(err);
    });
    
})*/