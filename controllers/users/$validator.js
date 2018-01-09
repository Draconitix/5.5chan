module.exports = function(data){
    var flags = 0;
    var errs = [];
    var emailReg = /^[a-zA-Z0-9.]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/g;
    var check = function(property){
        switch(property){
            case 'username': 
                if(data.username.length < 6){
                	flags++;
                    errs.push('Username must be at least 6 characters long.');
                } else if(/[!@#$%^&*()\.]/g.test(data.username) == true) {
                	flags++;
                    errs.push('Username must not contain any special characters.');
                }
                break;
            case 'password': 
                if(data.password.length < 6){
                	flags++;
                    errs.push('Password must be at least 6 characters long.');
                } else if(/[!@#$%^&*()\.]/g.test(data.password) == true) {
                	flags++;
                    errs.push('Password must not contain any special characters.');
                }
                break;
            case 'email':
                if(data.email.length < 11){
                    flags++;
                    errs.push('Email must contain at least 11 characters.');
                } else if(emailReg.test(data.email) == false){
                    flags++;
                    errs.push('Email must be a valid email.');
                }
                break;
            case 'firstname':
                if(/[!@#$%^&*()\.]/g.test(data.firstname) == true) {
                	flags++;
                    errs.push('First name must not contain any special characters.');
                }
                break;
            case 'lastname':
                if(/[!@#$%^&*()\.]/g.test(data.lastname) == true) {
                	flags++;
                    errs.push('Last name must not contain any special characters.');
                }
                break;    
        };
    };
    for(var i=0; i < Object.keys(data).length; i++){
        check(Object.keys(data)[i]);
    }
    return { flags: flags, errors: errs };
};