// JavaScript Document
app.controller('interfaceState', function($scope, $state, $cookies, interface, jwtHelper, formInputValidate){
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
        interface.join(name);
    };
    $scope.leaveChat = function(){
        interface.leave($scope.joined);
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
			if(err == 'update') {
				refrRooms();
			} 
        } else {
            refreshJoined();
            refrRooms();
        }
    };
    // Promises and db resources
    interface.promise(promCb);
    var refrRooms = function(){
        interface.getRooms().then(function(res){
            $scope.chatrooms = res;
        }, function(err){
            console.log(err);
        });
    }
    var refrUsers = function(type){
        interface.getUsers().then(function(res){
            var usrArr = [];
            usrArr[0] = 'wait';
            for(var i=0; i < res.length; i++){
                if($scope.user.username == res[i].username){
                    usrArr[0] = { username: $scope.user.username, creator: true, included: true };
                } else {
                    usrArr.push({ username: res[i].username, creator: false, included: false });
                }
            }
            if(type == 'add'){ $scope.addUsers = usrArr; }
            if(type == 'edit'){ 
				$scope.editUsers = usrArr; 
				if($scope.editroom.users != []){
					for(var i=0; i < $scope.editUsers.length; i++){
						if($scope.editroom.users[i] != undefined){
							if($scope.editroom.users[i] == $scope.editUsers[i].username){
								$scope.editUsers[i].included = true;
								
							}
						}
					}    
				}
			}
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
    refrUsers('add');
	var injectUsers = function(type){
        var arr;
        var array;
        var obj;
        if(type == 'add'){ $scope.newroom.users = []; array = $scope.newroom.users; obj = $scope.newroom; arr = $scope.addUsers }
        if(type == 'edit'){ $scope.editroom.users = []; array = $scope.editroom.users; obj = $scope.editroom; arr = $scope.editUsers }
		for(var i=0; i < arr.length; i++){
			if(arr[i].included == true){
				array.push(arr[i].username);	
			} else if(arr[i].creator == true){
				obj.creator = arr[i].username;
			}	
		};
	};
    $scope.createRoom = function(){
		// Grab all added users
		var data;
		var src = $scope.newroom;
		if($scope.newroom.private == true){
			injectUsers('add');
			data = src;	
		} else {
			data = { name: $scope.newroom.name, private:  $scope.newroom.private, users: [] };
		}
		var errs = formInputValidate.check(data);
		if(errs.num == 0){
			console.log(data)
			interface.createRoom(data).then(function(res){
				refrRooms();
				$scope.adding = false;
			}, function(err){
				console.log(err);
			})
		} else {
			console.log(errs);	
		}
    };
    
    // Delete room
    
    $scope.deleteRoom = function(name){
        interface.deleteRoom({ name: name }).then(function(res){
            refrRooms();
            $scope.editing = false;
        }, function(err){
            console.log(err);
        })
    };
    
    // Edit Room
    $scope.editInitial = {};
    $scope.editroom = {};
    $scope.editing = false;
    $scope.editUsers = []
    $scope.toggleEdit = function(index){
        if($scope.editing == false){
            $scope.editing = true;
            $scope.editroom = $scope.chatrooms[index];
            $scope.editInitial = angular.copy($scope.chatrooms[index]);
            refrUsers('edit');
			//$scope.$apply();
        } else {
            $scope.editing = false;
			refrRooms();
        }
    };
    $scope.editRoom = function(){
        var data;
		var src = $scope.editroom;
		if(src.private == true){
			injectUsers('edit');
			data = src;
            console.log(data);
		} else {
			data = { name: src.name, private:  src.private, users: [], user: $scope.user.username };
		}
        var errs = formInputValidate.check(data);
        if(errs.num == 0){
            interface.editRoom($scope.editInitial, $scope.editroom).then(function(res){
                $scope.editing = false;
            }, function(err){
                console.log(err);
            })    
        } else {
            console.log(errs);
        }
    }
    
    // Join chat if already in cookie
    if($scope.joined != false){
        interface.join($scope.joined);
    }
    
    // Messaging
    $scope.messages = [];
    $scope.sendMessage = function(text){
        interface.send(text);
    }
    var msgCb = function(msgData){
        $scope.messages.push(msgData);
    };
    interface.incoming(msgCb);
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
     }
});