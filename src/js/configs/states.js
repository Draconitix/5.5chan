app.config(function($stateProvider){
    $stateProvider.state('login', {
        url: '/login',
        templateUrl: '/partials/login.html',
        controller: 'loginState'
    }).state('register', {
		url: '/register',
		templateUrl: '/partials/register.html',
		controller: 'registerState'
	}).state('interface', {
		url: '/interface',
		templateUrl: '/partials/interface.html',
		controller: 'interfaceState'
}).run(function($state){
    $state.go('test');
});