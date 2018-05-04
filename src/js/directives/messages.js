app.directive('chatMessages', function($location, $anchorScroll, $timeout){
    return {
        restrict: 'E',
        scope: {
            messages: '=messages',
            authorize: '&'
        },
        templateUrl: 'partials/directives/chat-message.html',
        link: function(scope, ele, attrs){
            $timeout(function(){
                window.location.hash = "";
                $location.hash('bottomMessage')
                $anchorScroll();
                var elem = document.getElementById('bottomMessage');
                elem.scrollTop = elem.scrollHeight;
            }, 1000)
        }
    }
});