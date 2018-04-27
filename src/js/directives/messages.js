app.directive('chatMessages', function(){
    return {
        restrict: 'E',
        scope: {
            messages: '=messages',
            authorize: '&'
        },
        templateUrl: 'partials/directives/chat-message.html'
    }
});