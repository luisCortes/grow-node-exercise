var myFunctions = require('./../myFunctions.js');

exports.getRootPage = function(req, res){
	var url = "http://" + req.headers.host + req.url;
  var response = {};
	response.characters = url + "characters/";
  response.planetresidents = url + "planetresidents/";
	myFunctions.sendResponse(req, res, "Api Root", response);
};