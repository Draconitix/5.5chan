app.service('formInputValidate', function(){
    var fields;
    var data;
    var errorNum = 0;
    var errors = {
       username: "",
       password: "",
       email: "",
       firstname: "",
       lastname: "",
       desc: ""
    }; 
    
    var checkSwitch = function(field){
        switch(field){
            case 'username':
                if(data[field].length < 4){
                    errorNum++;
                    errors[field] = 'Username must have at least 4 characters.'; 
                } else if(data[field].length > 12) {
                    errorNum++;
                    errors[field] = 'Username must be less than 13 characters.';       
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
        }
    };
    
    var check = function(obj){
        fields = Object.keys(obj);
        data = obj;
        //console.log(fields)
        for(var i = 0; i < fields.length; i++){
        		//console.log(obj)
            if(data[fields[i]].length == 0 || data[fields[i]] == "" || data[fields[i]] == undefined){
                errorNum++;
                var cap = fields[i].charAt(0).toUpperCase() + fields[i].slice(1);
                errors[fields[i]] = cap + ' must not be empty.'; 
            } else if(fields[i] == 'email' || fields[i] == 'desc') {
                checkSwitch(fields[i]);  
            } else {
                checkSwitch(fields[i]);
                if(/[.!@#$%^&*()_+-=]/g.test(data[fields[i]]) == true){
                    errorNum++;
                    var cap = fields[i].charAt(0).toUpperCase() + fields[i].slice(1);
                    errors[fields[i]] = cap + ' must not contain any special characters.'; 
                }  
            }
        }
        errors.num = errorNum;
        return errors;
    };
    
    return check;

});