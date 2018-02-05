// I set this controller up because the file uploads are tricky to setup, so to save you from ripping your hair out, I made it for you.

app.controller('registerState', function($scope, $state, register){
    $scope.currentFile = "";
    $scope.changeFile(files){
        $scope.currentFile = files[0].name;
    }
});