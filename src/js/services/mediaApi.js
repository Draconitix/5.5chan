app.service('mediaApi', function($q, $http){
    var giphyApiKey = 'PFOaypSuP2CqECGQZOBGPEoAfzkv3qw1';
    var googleCustomSearchApiKey = 'AIzaSyCrbKJUSKv5nUmjTWDCMAlA0Bi93gUMYH0';
    var youtubeDataApiKey = 'AIzaSyABX2iZHGbLKOyYC_xeGliIW29oH4Rv5JM';
    var searchId = '001326175283701008867:blxac3r7dw0';
    var imgStart = 1;
    var imgPrevKeyword = null;
    var gifPrevKeyword = null;
    var gifStart = 1;
    var getYoutubeVideos = function(keyword){
        var deferred = $q.defer();
        $http({ method: 'GET', url: 'https://www.googleapis.com/youtube/v3/search', params: { part: 'snippet, id', q: keyword, type: 'video', key: youtubeDataApiKey, maxResults: 50, safeSearch: 'moderate' }}).then(function(res){
            // Medium Thumbnail Iframe dimensions are height: 180px && width: 320px;
            var vidData = res.data.items.map(function(e, i){
                    return { type: 'video', uri: 'https://www.youtube.com/embed/' + e.id.videoId, title: e.snippet.title, thumbnailUri: e.snippet.thumbnails.medium.url, viewed: false };  
            })
            deferred.resolve(vidData)
        }, function(err){
            deferred.reject(err)
        });
        return deferred.promise;
    };
    var getGifs = function(keyword){
        var deferred = $q.defer();
        if(gifPrevKeyword == keyword){
            gifStart = gifStart + 25;
        } else {
            gifStart = 1;   
        }
        if(gifStart <= 101){
        $http({ method: 'GET', url: 'http://api.giphy.com/v1/gifs/search', params: { q: keyword, api_key: giphyApiKey, rating: 'pg-13', lang: 'en', offset: gifStart }}).then(function(res){
            // Medium Thumbnail Iframe dimensions are height: 180px && width: 320px;
            var gifData = res.data.data.map(function(e, i){
                    return { type: 'gif', thumbnailUri: e.images.fixed_height_small.url, uri: e.images.original.url, height: e.images.fixed_height_small.height, width: e.images.fixed_height_small.width };  
            })
            deferred.resolve(gifData)
            gifPrevKeyword = keyword;
        }, function(err){
            deferred.reject(err)
        });
        } else {
            deferred.reject('Maximum amount of requests fulfilled.')
        }
        return deferred.promise;
    }
    var getGoogleImages = function(keyword){
       var deferred = $q.defer();    
       if(imgPrevKeyword == keyword){
            imgStart = imgStart + 10;
       } else {
            imgStart = 1;   
       }
        if(imgStart <= 81){
           $http({ method: 'GET', url: 'https://www.googleapis.com/customsearch/v1', params: { q: keyword, key: googleCustomSearchApiKey, cx: searchId, searchType: 'image', safe: 'high', start:  imgStart }}).then(function(res){
                var imgData = res.data.items.map(function(e, i){
                    return { type: 'image', uri: e.link, image: e.image };  
                })
                deferred.resolve(imgData)
                imgPrevKeyword = keyword;
            }, function(err){
                deferred.reject(err)
            });
        } else {
            deferred.reject('Maximum amount of requests fulfilled.')
        }
        return deferred.promise;
    }

    return { videos: getYoutubeVideos, images: getGoogleImages, gifs: getGifs }
});