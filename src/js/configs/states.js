app.config(function($stateProvider){
    $stateProvider.state('test', {
        url: '/test',
        templateUrl: '/partials/test.html',
        controller: 'test'
    }).state('register', {
		url: '/register',
		templateUrl: '/partials/register.html',
		controller: 'registerState'
	})
}).run(function($state){
    $state.go('test');
});