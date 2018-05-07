// JavaScript Document
app.controller('interfaceState', function($scope, $state, $cookies, interface, jwtHelper, formInputValidate, $sce, messageParser, $window){
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
        interface.getMessages(name).then(function(res){
            $scope.messages = res;
            //$scope.$apply();
        })
    };
    $scope.leaveChat = function(){
        interface.leave($scope.joined);
        $scope.joined = false;
        $scope.messages = [];
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
        /*var go = function(){
           window.scroll({
              top: 1000,
              behavior: "smooth"
            });
        };*/
        interface.join($scope.joined);
        interface.getMessages($scope.joined).then(function(res){
            $scope.messages = res;
            $scope.$apply();
        })
    }
    
    // Messaging
   
    $scope.messages = [];
    $scope.trustUrl = function(url){
        return $sce.trustAsResourceUrl(url);
    };
    $scope.message = { text: "" };
    $scope.atBottom = false;
    $scope.sendMessage = function(){
        interface.send($scope.message.text);
        var parts = messageParser($scope.message.text)
        var dt = new Date(Date.now());
        $scope.messages.push({ parts: parts, user: $scope.user.username, sentAt: Date.now(), date: getDate(dt) });
        $('.msgAreaParent, .messageChatArea, .messages').ready(function(){
            var elem = document.getElementsByClassName('msgAreaParent')[0];
            $('.msgAreaParent').scroll(function(){
                  var y = elem.scrollTop;
                  var hInit = $('.messageChatArea').innerHeight() - $('.msgAreaParent').outerHeight();
                  var h = Math.round(hInit);
                  var range = h - 200;
                  $scope.atBottom = range <= y && y <= h;
            });
            if($scope.atBottom == true){
                $(".msgAreaParent").animate({
                     scrollTop: elem.scrollHeight
                 }, 600);
            }
        })
    }
    var getDate = function (date) {
              var year = date.getFullYear();
              var monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
              var month = (1 + date.getMonth()).toString();
              month = month.length > 1 ? month : '0' + month;
              var day = date.getDate().toString();
              day = day.length > 1 ? day : '0' + day;
              var hours = date.getHours();
              var minutes = date.getMinutes();
              var ampm = hours >= 12 ? 'pm' : 'am';
              hours = hours % 12;
              hours = hours ? hours : 12; // the hour '0' should be '12'
              minutes = minutes < 10 ? '0'+minutes : minutes;
              var strTime = hours + ':' + minutes + ' ' + ampm;
              return monthNames[month - 1] + ' ' + Math.round(day) + ', ' + year + ' ' + strTime;
    };
    var msgCb = function(msgData){
        var dt = new Date(Date.now());
        msgData.date = getDate(dt);
        $scope.messages.push(msgData);
        $scope.$apply();
        $('.msgAreaParent, .messageChatArea, .messages').ready(function(){
            var elem = document.getElementsByClassName('msgAreaParent')[0];
            $('.msgAreaParent').scroll(function(){
                  var y = elem.scrollTop;
                  var hInit = $('.messageChatArea').innerHeight() - $('.msgAreaParent').outerHeight();
                  var h = Math.round(hInit);
                  var range = h - 200;
                  $scope.atBottom = range <= y && y <= h;
            });
            if($scope.atBottom == true){
                $(".msgAreaParent").animate({
                     scrollTop: elem.scrollHeight
                 }, 600);
            }
    })
    }
 
  
    $('#msgAreaParent').scroll(function(){
        var elem = document.getElementById('msgAreaParent');
    })
    interface.incoming(msgCb);
    $scope.editMessage = function(query, pos){
        var m = $scope.messages[pos];
        var newParts = messageParser(query.edit);
        //console.log(query);
        /*$scope.messages[pos].editing = false;
        var newParts = messageParser(query.edit);
        $scope.messages[pos].parts = newParts;
        $scope.messages[pos].text = query.edit;*/
        var q = { chatroom: m.chatroom, text: m.text };
        var d = { parts: newParts, user: m.user, chatroom: m.chatroom, sentAt: m.sentAt, text: query.edit }
        interface.editMessage(q, d).then(function(res){
            m.parts = newParts;
            m.text = query.edit;
            m.editing = false;
            console.log(newParts)
        }, function(err){
            console.log(err);
        });
    };    
    
    $scope.deleteMessage = function(query){
        interface.delMessage(query).then(function(res){
        $scope.messages.map(function(e, i){
            if(query == e){
                $scope.messages.splice(i, 1);
            }
        })
        }, function(err){
            console.log(err);
        })
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
     }
});