app.directive('apiSearch', function(){
    return {
        restrict: 'E',
        scope: {
            results: '=results',
            contentclick: '&',
            searchVideos: '&',
            searchImages: '&',
            authorize: '&',
            toggle: '=toggle'
        },
        templateUrl: 'partials/directives/apiSearch.html',
        link: function(scope, elem, attrs){
            scope.searchType = 'all';
            scope.setSearchType = function(type){
                scope.searchType = type;
            };
            scope.input = { keyword: '' };
            scope.searchError = '';
            scope.search = function(keyword){
                if(keyword.length > 0){
                    switch(scope.searchType){
                        case 'all':
                            scope.searchImages(keyword)
                            scope.searchVideos(keyword)
                            break;
                        case 'videos':
                            scope.searchVideos(keyword)
                            break;
                        case 'images':
                            scope.searchImages(keyword)
                            break;
                        default: 
                            scope.searchImages(keyword)
                            scope.searchVideos(keyword)
                    }
                } else {
                    scope.searchError = 'No keyword was passed.'
                }
            };
        }
    }
});