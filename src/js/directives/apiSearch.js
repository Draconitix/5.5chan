app.directive('apiSearch', function(){
    return {
        restrict: 'E',
        scope: {
            results: '=results',
            contentclick: '&',
            mediatype: '=mediatype',
            search: '&',
            authorize: '&'
        },
        templateUrl: 'partials/directives/apiSearch.html'
});