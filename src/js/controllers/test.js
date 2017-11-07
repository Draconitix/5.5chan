app.controller('test', ['$scope', 'universal', function($scope, universal){
    $scope.assets = universal.query();
}]);