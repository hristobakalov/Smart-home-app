	
	//initiallization
    var users = require('./controllers/users');
	var roles = require('./controllers/roles');
	var sensors = require('./controllers/sensors');
	var relations = require('./controllers/relations');
	var auth = require('./controllers/authentication');
	var express = require('express');
	var app = express();
	app.post('/login', auth.login);
	
	app.get('/', users.connectionCheck);
	//users
    app.get('/api/users', users.findAll);
    app.get('/api/users/:id', users.findById);
	app.get('/api/users/:email', users.findByEmail);
    app.post('/api/users', users.add);
    app.put('/api/users/:id', users.update);
    app.delete('/api/users/:id', users.delete);
	
	app.get('/api/users/impport', users.import);
	
	//roles
    app.get('/api/roles', roles.findAll);
    app.get('/api/roles/:id', roles.findById);
	app.get('/api/roles/:name', roles.findByName);
    app.post('/api/roles', roles.add);
    app.put('/api/roles/:id', roles.update);
    app.delete('/api/roles/:id', roles.delete);
	app.get('/api/roles/import', roles.import);
	
	//sensors
    app.get('/api/sensors', sensors.findAll);
    app.get('/api/sensors/:id', sensors.findById);
    app.post('/api/sensors', sensors.add);
    app.put('/api/sensors/:id', sensors.update);
    app.delete('/api/sensors/:id', sensors.delete);
	app.get('/api/sensors/import', sensors.import);
	app.post('/api/sensors/switch', sensors.SwitchSensor);
	
	app.get('/api/userrolerelations', relations.findAllUserRoleRelations);
	app.get('/api/relations/user/:id/role', relations.findRoleByUserId);
	app.post('/api/relations/user/role', relations.addUserRole);
	app.put('/api/relations/user/:id/role',relations.updateRoleByUserId);

	app.get('/api/relations/role/sensor/all', relations.findSensorsByRoleId);
	app.post('/api/relations/role/:id/sensor', relations.setSensorsToRole);

module.exports = app;