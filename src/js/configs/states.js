app.config(function($stateProvider){
    $stateProvider.state('register', {
        url: '/register',
        templateUrl: '/partials/register.html',
        controller: 'register'
    }).state('login', {
        url: '/login',
        templateUrl: '/partials/login.html',
        controller: 'login'
    }).state('dashboard', {
        url: '/dashboard',
        templateUrl: '/partials/dashboard.html',
        controller: 'dashboard'
        /* resolve: {
            auth: function($state, userLogin){
                var promise = userLogin.getSession();
                promise.then(function(data){
                    return data;
                }, function(error){
                    $state.go('login');
                });
            }
        } */
    }).state('message', {
        url: '/message',
        templateUrl: '/partials/message.html',
        controller: 'userMessage'
    });
}).run(function($state){
    $state.go('message');
});