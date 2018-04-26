app.service('formInputValidate', function($http, $q, $cookies){
    
	// $http functions for checking if email/username exists.
	
	var takenPromise = function(field, value){
		var deferred = $q.defer();
		if(field === 'username'){
			$http({ method: 'GET', url: 'chat/user/list',  params: { username: value } }).then(function(res){
				deferred.resolve(res.data);
			}, function(err){
				deferred.reject(err);
			});
		} else if(field === 'email'){
			$http({ method: 'GET', url: 'chat/user/list',  params: { email: value } }).then(function(res){
				deferred.resolve(res.data);
			}, function(err){
				deferred.reject(err);
			});
		}
		return deferred.promise;
	}
	
	// Vars tracking data from input
	var fields;
    var data;
    var errorNum = 0;
    var errors = {
       username: "",
       password: "",
       email: "",
       firstname: "",
       lastname: "",
       desc: "",
       name: "",
       users: "",
       private: ""    
    }; 
	
    // Checks specific field for errors
    var checkSwitch = function(field){
        switch(field){
            case 'username':
                if(data[field].length < 4){
                    errorNum++;
                    errors[field] = 'Username must have at least 4 characters.'; 
                } else if(data[field].length > 15) {
                    errorNum++;
                    errors[field] = 'Username must be less than 16 characters.';       
                }
                break;
            case 'password':
                if(data[field].length < 6){
                    errorNum++;
                    errors[field] = 'Password must be at least 6 characters.';
                }
                break;
            case 'email':
                if(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(data[field]) == false){
                    errorNum++;
                    errors[field] = 'Email must be a valid email.';
                }
                break;
            case 'desc':
                if(data[field].length < 4){
                    errorNum++;
                    errors[field] = 'Description must be at least 4 characters.'; 
                } else if(data[field].length > 250){
                    errorNum++;
                    errors[field] = 'Description must be less than 250 characters.'
                }
                break;
            case 'firstname':
                if(data[field].length > 12){
                    errorNum++;
                    errors[field] = 'Firstname must be less than 13 characters.'; 
                }
                break;
            case 'lastname':
                if(data[field].length > 12){
                    errorNum++;
                    errors[field] = 'Lastname must be less than 13 characters.'; 
                }
                break;   
            case 'name':    
                if(data[field].length < 4){
                    errorNum++;
                    errors[field] = 'Name must have at least 4 characters.'; 
                } else if(data[field].length > 20) {
                    errorNum++;
                    errors[field] = 'Name must be less than 21 characters.';       
                }
                break;
            case 'private':
                if(typeof data[field] != "boolean"){
                    errorNum++;
                    errors[field] = 'Private must be true or false';   
                }
                break;
            case 'users':
                var usrs = data[field];
                for(var u; u < data[field].length; u++){
                    if(/[.!@#$%^&*()_\+\-\=]/g.test(usrs[u]) == true){
                        errorNum++;
                        errors[field] = "Usernames must not contain any special characters"
                    }
                }
                if(typeof data['private'] == "boolean"){
                    if(Array.isArray(usrs) == true){
                        if(usrs.length == undefined || usrs.length == 0){
                            errorNum++;
                            errors[field] = "Users must be added in private chatroom";
                        }
                    } else {
                        errorNum++;
                        errors[field] = "Users field must be an array.";
                    }
                } else {
                    errorNum++;
                    errors[field] = "Users must be validated with private boolean."
                }
                break;
        }
    };
    
	// Main function for returning any errors with forms
    var check = function(obj){
        errors = {
           username: "",
           password: "",
           email: "",
           firstname: "",
           lastname: "",
           desc: "",
           name: "",
           users: "",
           private: ""
        }; 
        errorNum = 0;
        fields = Object.keys(obj);
        data = obj;
        if(fields.length > 0){
          for(var i = 0; i < fields.length; i++){
             
            //console.log(obj)
            if(data[fields[i]].length == 0 || data[fields[i]] == "" || data[fields[i]] == undefined){
                    if(fields[i] != 'private' && fields[i] != "users" && fields[i] != "__v"){
                        errorNum++;
                        var cap = fields[i].charAt(0).toUpperCase() + fields[i].slice(1);
                        errors[fields[i]] = cap + ' must not be empty.'; 
                    }
                } else if(fields[i] == 'email' || fields[i] == 'desc') {
                    checkSwitch(fields[i]);  
                } else {
                    checkSwitch(fields[i]);
                    if(/[.!@#$%^&*()_\+\-\=]/g.test(data[fields[i]]) == true && fields[i] != "users"){
                        errorNum++;
                        var cap = fields[i].charAt(0).toUpperCase() + fields[i].slice(1);
                        errors[fields[i]] = cap + ' must not contain any special characters.'; 
                    }  
                }
            }   
        } else {
            errorNum++;
            errors.main = "Fields must not be empty.";
        }
        errors.num = errorNum;
        return errors;
    };
    
    return { check: check, taken: takenPromise };

});