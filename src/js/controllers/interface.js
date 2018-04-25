// JavaScript Document
app.controller('interfaceState', function($scope, $state, $cookies, userSocket, jwtHelper, formInputValidate){
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
    // Promises and db resources
    userSocket.promise(promCb);
    var refrRooms = function(){
        userSocket.getRooms().then(function(res){
            $scope.chatrooms = res;
        }, function(err){
            console.log(err);
        });
    }
    var refrUsers = function(){
        userSocket.getUsers().then(function(res){
            var usrArr = [];
            usrArr[0] = 'wait';
            for(var i=0; i < res.length; i++){
                if($scope.user.username == res[i].username){
                    usrArr[0] = { username: $scope.user.username, creator: true, included: true };
                } else {
                    usrArr.push({ username: res[i].username, creator: false, included: false });
                }
            }
            $scope.addUsers = usrArr;
        }, function(err){
            console.log(err);
        });
    }
    refrRooms();
    // Create chatroom
    $scope.newroom = { name: '', private: false, users: []};
    $scope.addErrs = { name: '', private: '', users: '' };
    $scope.adding = false;
    $scope.addUsers = [];
    $scope.toggleCreate = function(){
        $scope.adding = $scope.adding == true ? false : true;
    };
    refrUsers();
	var injectUsers = function(){
		for(var i=0; i < $scope.addUsers.length; i++){
			if($scope.addUsers[i].included == true){
				$scope.newroom.users.push($scope.addUsers[i].username);	
			} else if($scope.addUsers[i].creator == true){
				$scope.newroom.creator = $scope.addUsers[i].username;
			}	
		};
	};
    $scope.createRoom = function(){
		// Grab all added users
		var data;
		var src = $scope.newroom;
		if($scope.newroom.private == true){
			injectUsers();
			data = src;	
		} else {
			data = { name:  $scope.newroom.name, private:  $scope.newroom.private, users: [] }
		}
		var errs = formInputValidate.check(data);
		if(errs.num == 0){
			console.log(data)
			/*userSocket.createRoom(data).then(function(res){
				refrRooms();
				$scope.adding = false;
			}, function(err){
				console.log(err);
			})*/	
		} else {
			console.log(errs);	
		}
    };
    
    // Join chat if already inc cookie
    if($scope.joined != false){
        userSocket.join($scope.joined);
    }
    // Form validation
    $scope.validate = function(input, field){
        var obj = {};
        obj[field] = input;
        if(input != undefined){
            var errs = formInputValidate.check(obj);
            if(errs.num > 0){
                $scope.addErrs[field] = errs[field];
                console.log(JSON.stringify(errs[field]));
                //$scope.$apply();
            } else if(field === "username") {
                if(input != $scope.user.username && input != $scope.user.email){
                    formInputValidate.taken(field, input).then(function(res){
                        if(res.length != 0){
                            var capLetter = field.charAt(0).toUpperCase(), restStr = field.split(field[0]), fullStr = capLetter + restStr[1] + ' is already taken.'  
                            $scope.addErrs[field] = fullStr;
                        } else {
                           $scope.addErrs[field] = ""; 
                        }
                    })  
                }
            } else {
                $scope.addErrs[field] = "";
            }    
        }
     };
});