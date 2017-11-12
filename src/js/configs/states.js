app.config(function($stateProvider){
    $stateProvider.state('test', {
        url: '/test',
        templateUrl: '/partials/test.html',
        controller: 'test'
    })
}).run(function($state){
    $state.go('test');
});