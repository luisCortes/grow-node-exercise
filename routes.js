module.exports = function(app){
    var apiRoot = require('./controllers/root');
    app.get('/', apiRoot.getRootPage);

    var characters = require('./controllers/characters');
    app.get('/characters', characters.findAll);
    app.get('/characters/', characters.findAll);
    app.get('/character/:id', characters.findById);
    app.get('/character/:id/', characters.findById);

    var planets = require('./controllers/planets');
    app.get('/planetresidents', planets.findAll);
    app.get('/planetresidents/', planets.findAll);

    app.get('/*', function(req, res){
	  res.send404();
	});
};