app.directive('apiSearch', function(){
    return {
        restrict: 'E',
        scope: {
            results: '=results',
            contentclick: '&',
            searchvids: '&searchvids',
            searchimgs: '&searchimgs',
            searchgifs: '&searchgifs',
            authorize: '&',
            toggle: '=toggle'
        },
        templateUrl: 'partials/directives/apiSearch.html',
        link: function(scope, elem, attrs){
            console.log('apiSearch directive ready')
            scope.searchType = 'video';
            $('.apiSearchWrapper').ready(function(){
                new PerfectScrollbar('.apiSearchWrapper');
            })
            scope.setSearchType = function(type){
                scope.searchType = type;
            };
            scope.keyword = { input: '' };
            scope.searchError = '';
            scope.search = function(q){
                if(q.length > 0){
                    if(scope.searchType == 'video'){
                        scope.searchvids({ keyword: q })
                    }
                    if(scope.searchType == 'image'){
                        scope.searchimgs({ keyword: q })
                    }
                    if(scope.searchType == 'gif'){
                        scope.searchgifs({ keyword: q })
                    }
                } else {
                    scope.searchError = 'No keyword was passed.'
                }
            };
        }
    }
});