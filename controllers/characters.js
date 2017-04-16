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
  		sortByObject.mass = {};
  		sortByObject.mass.sortBy = "mass";
  		sortByObject.mass.sortType = "number";
  		sortByObject.height = {};
  		sortByObject.height.sortBy = "height";
  		sortByObject.height.sortType = "number";
  		if(dataNotAvailable){
  			response = {
			    "detail": "Not found"
			};
  		}else{
  			var newArray = data.characters.slice();
  			response.count = data.characters.length;
  			response.next = myFunctions.getNextPageUrl(req, myFunctions.getNumberOfPages(data.characters.length));
  			response.previous = myFunctions.getPreviousPageUrl(req, myFunctions.getNumberOfPages(data.characters.length));
			response.results = myFunctions.paginateResponse(myFunctions.sortResponse(newArray, sortByObject[req.query.sort]))[req.query.page ? req.query.page-1 : 0];
			if(!response.results){
	  			response = {
				    "detail": "Not found"
				};
			}
  		}
  		myFunctions.sendResponse(req, res, "Characters List", response);
  	};
  	myFunctions.checkData(0, processResponse, data);
};

exports.findById = function(req, res){
	var processResponse = function(dataNotAvailable){
		//Search character only by first name
		var name = req.params.id;
		var result;
		var response = {};
		var characters = data.characters.slice();
		for(i=0; i<characters.length; i++){
			var s1 = characters[i].name;
			result = s1.indexOf(" ");
			if(result > -1){
				var s2 = name + " ";
			}else{
				var s2 = name
			}
			s1 = s1.toLowerCase().replace("-", "");
			s2 = s2.toLowerCase().replace("-", "");
			result = s1.indexOf(s2);
			if(result > -1){
				response = Object.assign({}, characters[i]);;
				response.homeworld = myFunctions.findWhere(data.planets, {url: response.homeworld}).name;
				var tempArray = [];
				for(i=0; i<response.films.length; i++){
					tempArray.push(myFunctions.findWhere(data.films, {url: response.films[i]}).title);
				}
				response.films = tempArray;
				tempArray = [];
				for(i=0; i<response.species.length; i++){
					tempArray.push(myFunctions.findWhere(data.species, {url: response.species[i]}).name);
				}
				response.species = tempArray;
				tempArray = [];
				for(i=0; i<response.vehicles.length; i++){
					tempArray.push(myFunctions.findWhere(data.vehicles, {url: response.vehicles[i]}).name);
				}
				response.vehicles = tempArray;
				tempArray = [];
				for(i=0; i<response.starships.length; i++){
					tempArray.push(myFunctions.findWhere(data.starships, {url: response.starships[i]}).name);
				}
				response.starships = tempArray;
				break;
			}
		}
		myFunctions.sendResponse(req, res, "Character Info", response);
	};
	myFunctions.checkData(0, processResponse, data);
};