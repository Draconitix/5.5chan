// JavaScript Document
app.controller('interfaceState', function($scope, $state, $cookies, userSocket, jwtHelper){
	// User data
    var token = $cookies.get('accessToken');
    if(typeof token === 'undefined'){ $state.go('login'); };
    $scope.user = jwtHelper.decodeToken(token);
    $scope.logout = function(){
		$cookies.remove('accessToken');
		$state.go('login');
	};
    // Chat data
    var failed = false;
    $scope.chatrooms = [];
    $scope.joined = $cookies.get('chatroom') != undefined ? $cookies.get('chatroom') : false;
	$scope.posts = [];
    $scope.joinChat = function(name){
        userSocket.join(name);
    };
    $scope.leaveChat = function(){
        userSocket.leave($scope.joined);
        $scope.joined = false;
    };
    // Cht error handling
    var refreshJoined = function(){ 
        $scope.joined = $cookies.get('chatroom');
        $scope.$apply();
    };
    var promCb = function(err){
        if(err){
            console.log(err);
        } else {
            refreshJoined();
        }
    };
    userSocket.promise(promCb);
    var refrRooms = function(){
        userSocket.getRooms().then(function(res){
            $scope.chatrooms = res;
        }, function(err){
            console.log(err);
        });
    }
    refrRooms();
    // Create chatroom
    $scope.newroom = { name: '', private: false, users: []};
    $scope.addErrs = { name: '', private: '', users: '' };
    $scope.adding = false;
    $scope.toggleCreate = function(){
        $scope.adding = $scope.adding == true ? false : true;
    };
    $scope.createRoom = function(){
        userSocket.createRoom($scope.newroom).then(function(res){
            $scope.adding = false;
        }, function(err){
            console.log(err);
        })
    };
    
    // Join chat if already inc cookie
    if($scope.joined != false){
        userSocket.join($scope.joined);
    }
});