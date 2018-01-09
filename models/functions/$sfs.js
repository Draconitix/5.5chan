var sfs = function(data){
    var sfsArr = ['password', 'uploadsPath'];
    if(Array.isArray(data) == false) {
        var currRep = data;
            for(var x in currRep){
                for(var y=0; y < sfsArr.length; y++){
                    if(x == sfsArr[y]){
                        currRep[x] = undefined;
                    }
                }
            }   
        return data;       
    } else {
        for(var i=0; i < data.length; i++){
        var currRep = data[i];
            for(var x in currRep){
                for(var y=0; y < sfsArr.length; y++){
                    if(x == sfsArr[y]){
                        currRep[x] = undefined;
                    }
                }
            }   
        }
        return data;
    }
    
};

module.exports = sfs;