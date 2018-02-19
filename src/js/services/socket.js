app.service('userSocket', function($cookies){
    var mainSocket = io.connect('http://localhost:9000', {
        'query': 'token=' + $cookies.get('accessToken')
    });
    
    return mainSocket;
});