var express = require('express');
var slash   = require('express-slash');
var bodyParser = require('body-parser');
var Autolinker = require( 'autolinker' );
var swapi = require('./swapiServices');
var app = express();

var characters = new Array();
var planets = new Array();

app.set('view engine', 'ejs');
app.use(express.static('public'));

// Because you're the type of developer who cares about this sort of thing! 
app.enable('strict routing');
 
// Create the router using the same routing options as the app. 
var router = express.Router({
    caseSensitive: app.get('case sensitive routing'),
    strict       : app.get('strict routing')
});

var statusText = {
    100: 'Continue',
    101: 'Switching Protocols',
    200: 'OK',
    201: 'Created',
    202: 'Accepted',
    203: 'Non Authoritative Information',
    204: 'No Content',
    205: 'Reset Content',
    206: 'Partial Content',
    300: 'Multiple Choices',
    301: 'Moved Permanently',
    302: 'Found',
    303: 'See Other',
    304: 'Not Modified',
    305: 'Use Proxy',
    306: 'Reserved',
    307: 'Temporary Redirect',
    400: 'Bad Request',
    401: 'Unauthorized',
    402: 'Payment Required',
    403: 'Forbidden',
    404: 'Not Found',
    405: 'Method Not Allowed',
    406: 'Not Acceptable',
    407: 'Proxy Authentication Required',
    408: 'Request Timeout',
    409: 'Conflict',
    410: 'Gone',
    411: 'Length Required',
    412: 'Precondition Failed',
    413: 'Request Entity Too Large',
    414: 'Request Uri Too Long',
    415: 'Unsupported Media Type',
    416: 'Requested Range Not Satisfiable',
    417: 'Expectation Failed',
    428: 'Precondition Required',
    429: 'Too Many Requests',
    431: 'Request Header Fields Too Large',
    500: 'Internal Server Error',
    501: 'Not Implemented',
    502: 'Bad Gateway',
    503: 'Service Unavailable',
    504: 'Gateway Timeout',
    505: 'HTTP Version Not Supported',
    511: 'Network Authentication Required'
};

var contentNegotiation = function (req, res, next) {
    // Return either HTML or JSON, depending on request 'Accept' header.
    // Invoked when using `res.sendData(...)`.
    var accept = req.headers['accept'];
    if(accept){
       var elements = accept.split(',');
        var useHtml = false;
        for (idx = 0; idx < elements.length; idx++) {
            var element = elements[idx].split(';')[0];
            if (element == 'text/html') {
                useHtml = true;
                break;
            };
        };
    };
    res.sendData = function(data){
        var headers = JSON.stringify(data.headers, null, '    ');
        var body = JSON.stringify(data.body, null, '    ');
        if (useHtml) {
        	if(data.list == "Character Info"){
        		this.render('character', {
        		    code: this.statusCode,
        		    statusText: statusText[this.statusCode] || '',
        		    list: data.list,
        		    method: data.method,
        		    headers: headers,
        		    url: data.url,
        		    body: data.body
        		});
        	}else{
        		this.render('index', {
        		    code: this.statusCode,
        		    statusText: statusText[this.statusCode] || '',
        		    list: data.list,
        		    method: data.method,
        		    headers: headers,
        		    url: data.url,
        		    body: Autolinker.link( body, { newWindow: false, stripPrefix: false } )
        		});
        	}
        }else{
            this.send(body);
        }
    };
    res.send404 = function(){
        if (useHtml) {
            this.render('404', {});
        }else{
            this.status(404).send('This is not the page you are looking for.')
        }
    };
    next();
};

var errorHandler = function(err, req, res, next){
	console.log(err);
    // Ensure that errors are content negotiated too.
    res.status(500).sendData({'error': err.stack.split(':')[0]});
};

app.use(contentNegotiation);
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(errorHandler);

// Add the `slash()` middleware after your app's `router`, optionally specify 
// an HTTP status code to use when redirecting (defaults to 301). 
app.use(router);
app.use(slash());

require('./routes')(router);

var server = app.listen(8081, function () {
	var host = server.address().address;
	var port = server.address().port;
	if(host == "::") host = "localhost";
	console.log("Loading data...");

	//Checking if the App is ready
	var isAPIReady = function(){
		if(planets.length > 0 && characters.length > 0 && films.length > 0 && species.length > 0 && vehicles.length > 0 && starships.length > 0) console.log("Star Wars API by Grow (Node-Express-EJS) is ready at http://%s:%s", host, port);
	}

	//Loading Planets Data
	swapi.getList("planets").then(function(res){
		planets = exports.planets = res;
		console.log("Planets list is now available!!!");
		isAPIReady();
	});

	//Loading Characters Data
	swapi.getList("people").then(function(res){
		characters = exports.characters = res;
		console.log("People list is now available!!!");
		isAPIReady();
	});

	//Loading Films Data
	swapi.getList("films").then(function(res){
		films = exports.films = res;
		console.log("Films list is now available!!!");
		isAPIReady();
	});

	//Loading Species Data
	swapi.getList("species").then(function(res){
		species = exports.species = res;
		console.log("Species list is now available!!!");
		isAPIReady();
	});

	//Loading Vehicles Data
	swapi.getList("vehicles").then(function(res){
		vehicles = exports.vehicles = res;
		console.log("Vehicles list is now available!!!");
		isAPIReady();
	});

	//Loading Starships Data
	swapi.getList("starships").then(function(res){
		starships = exports.starships = res;
		console.log("Starships list is now available!!!");
		isAPIReady();
	});

});