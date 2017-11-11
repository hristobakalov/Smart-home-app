var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var exec = require('child_process').exec;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.htm');
	console.log('get /');
});


app.post('/', function (req, res) {
   res.sendStatus(200);
	console.log('post /');
});


app.get('/payload', function (req, res) {
    res.sendStatus(200);
	console.log('get /payload');
});

app.post('/payload', function (req, res) {
	//verify that the payload is a push from the correct repo
	//verify repository.name == 'wackcoon-device' or repository.full_name = 'DanielEgan/wackcoon-device'
	console.log(req.body.pusher.name + ' just pushed to ' + req.body.repository.name);

	if(req.body.repository.name !== "Smart-home-app") {
		return res.sendStatus(500);
	}
	console.log('kill running server');
	exec('kill -9 $(ps aux | grep \'node\ Smart-home-app/server/server.js\' | awk \'{print $2}\')', execCallback);
	// reset any changes that have been made locally
	exec('git -C ../Smart-home-app reset --hard', execCallback);

	// and ditch any files that have been added locally too
	exec('git -C ../Smart-home-app clean -df', execCallback);

	console.log('pulling code from GitHub...');
	// now pull down the latest
	exec('git -C ../Smart-home-app pull -f', execCallback);

	// and npm install with --production
	//exec('npm -C ../Smart-home-app install', execCallback);

	console.log('running server');
	setTimeout(function(){
		exec('node ../Smart-home-app/server/server.js', execCallback);
	},1000);
	
	res.sendStatus(200);
	res.end();
});



app.listen(5000, function () {
	console.log('listening on port 5000');
	exec('kill -9 $(ps aux | grep \'node\ Smart-home-app/server.js\' | awk \'{print $2}\')', execCallback);
	setTimeout(function(){
		exec('node ../Smart-home-app/server/server.js', execCallback);
	},1000);
	
	
});

function execCallback(err, stdout, stderr) {
	if(stdout) console.log(stdout);
	if(stderr) console.log(stderr);
}