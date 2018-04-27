var app = angular.module('msgUnitTest', []);

app.config(function($interpolateProvider) {
  $interpolateProvider.startSymbol('{[{');
  $interpolateProvider.endSymbol('}]}');
});

app.controller('mainCon', function($scope, $sce){
    $scope.messages = [{ parts: [{ type: 'text', text: 'asdf' }, { type: 'video', url: 'https://www.youtube.com/embed/cixW6rogZ48' }] }];
    $scope.trustUrl = function(url){
        return $sce.trustAsResourceUrl(url);
    };
});

app.directive('chatMessages', function(){
    return {
        restrict: 'E',
        scope: {
            messages: '=messages',
            authorize: '&'
        },
        templateUrl: 'chat-message.html'
    }
});