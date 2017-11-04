module.exports = function(app){
	//initiallization
    var users = require('./controllers/users');
	var roles = require('./controllers/roles');
	var sensors = require('./controllers/sensors');
	var relations = require('./controllers/relations');
	
	
	//users
    app.get('/users', users.findAll);
    app.get('/users/:id', users.findById);
    app.post('/users', users.add);
    app.put('/users/:id', users.update);
    app.delete('/users/:id', users.delete);
	app.get('/import', users.import);
}