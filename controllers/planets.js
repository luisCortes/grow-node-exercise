var data = require('./../server.js');
var myFunctions = require('./../myFunctions.js');

exports.findAll = function(req, res){
  	var processResponse = function(dataNotAvailable){
  		var response = {};
  		//Declare all the available sortBy options and specify the sortType for each option
  		var sortByObject = {};
  		sortByObject.name = {};
  		sortByObject.name.sortBy = "name";
  		sortByObject.name.sortType = "string";
  		if(dataNotAvailable){
  			response = {
			    "detail": "Not found"
			};
  		}else{
  			var newArray = data.planets.slice();
  			response.count = data.planets.length;
  			response.next = myFunctions.getNextPageUrl(req, myFunctions.getNumberOfPages(data.planets.length));
  			response.previous = myFunctions.getPreviousPageUrl(req, myFunctions.getNumberOfPages(data.planets.length));
			newArray = myFunctions.paginateResponse(myFunctions.sortResponse(newArray, sortByObject[req.query.sort]))[req.query.page ? req.query.page-1 : 0];
			response.results = {};
			for(i=0; i<newArray.length; i++){
				response.results[newArray[i].name] = [];
				for(j=0; j<newArray[i].residents.length; j++){
					response.results[newArray[i].name].push(myFunctions.findWhere(data.characters, {url: newArray[i].residents[j]}).name);
				}
  			} 
			if(!response.results){
	  			response = {
				    "detail": "Not found"
				};
			}
  		}
  		myFunctions.sendResponse(req, res, "Planetresidents List", response);
  	};
  	myFunctions.checkData(0, processResponse, data);
};