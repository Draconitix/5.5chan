app.config(function($stateProvider){
    $stateProvider.state('login', {
        url: '/login',
        templateUrl: '/partials/login.html',
        controller: 'loginState'
    }).state('register', {
		url: '/register',
		templateUrl: '/partials/register.html',
		controller: 'registerState'
	})
}).run(function($state){
    $state.go('test');
});