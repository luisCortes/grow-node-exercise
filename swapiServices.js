var swapi = require('swapi-node');
var Q = require('q');

exports.getList = function(listName){
	console.log("Loading " + listName + "...");
  	var newArray = new Array();
  	var deferred = Q.defer();
  	var getNewPage = function(newArray, result){
  		result.nextPage().then(function(nextResult){
  			if(nextResult){
	  			for(i=0; i<nextResult.results.length; i++){
	  				newArray.push(nextResult.results[i]);
	  			}
	  			if(result.next){
		  	    	getNewPage(newArray, nextResult);
		  	    }
  			}else{
    	  	    deferred.resolve(newArray);
  			}
  		}).catch(function (err) {
		    console.log(err);
		    deferred.reject(new Error(err));
		});
  	};
  	swapi.get('http://swapi.co/api/' + listName).then(function (result){
  	    if(result && result.results){
	  	    for(i=0; i<result.results.length; i++){
				newArray.push(result.results[i]);
			}
  	    }
  	    if(result.next != null){
  	    	getNewPage(newArray, result);
  	    }else{
  	    	deferred.resolve(newArray);
  	    }
  	}).catch(function (err) {
  	    console.log(err);
  	    deferred.reject(new Error(err));
  	});
  	return deferred.promise;
};