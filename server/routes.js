module.exports = function(app){
	//initiallization
    var users = require('./controllers/users');
	var roles = require('./controllers/roles');
	var sensors = require('./controllers/sensors');
	var relations = require('./controllers/relations');
	
	
	//users
    app.get('/users', users.findAll);
    app.get('/users/:id', users.findById);
	app.get('/users/:email', users.findByEmail);
    app.post('/users', users.add);
    app.put('/users/:id', users.update);
    app.delete('/users/:id', users.delete);
	
	app.get('/users/impport', users.import);
	
	//roles
    app.get('/roles', roles.findAll);
    app.get('/roles/:id', roles.findById);
	app.get('/roles/:name', roles.findByName);
    app.post('/roles', roles.add);
    app.put('/roles/:id', roles.update);
    app.delete('/roles/:id', roles.delete);
	app.get('/roles/import', roles.import);
	
	//sensors
    app.get('/sensors', sensors.findAll);
    app.get('/sensors/:id', sensors.findById);
    app.post('/sensors', sensors.add);
    app.put('/sensors/:id', sensors.update);
    app.delete('/sensors/:id', sensors.delete);
	app.get('/sensors/import', sensors.import);
	app.post('/sensors/switch', sensors.SwitchSensor);
	
	app.get('/userrolerelations', relations.findAllUserRoleRelations);
	app.get('/relations/user/:id/role', relations.findRoleByUserId);
	app.post('/relations/user/role', relations.addUserRole);
	
}