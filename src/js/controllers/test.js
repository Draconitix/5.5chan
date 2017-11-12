app.controller('test', ['$scope', 'universal', function($scope, universal){
    $scope.assets = universal.query();
	$scope.test = "Watch your profanity.";
}]);
