var express = require('express');
var app = express();
app.get('/', function(req, res) {
  res.send('Hello Seattle\n');
});
app.listen(3001);
console.log('Listening on port 3001...');

app.get('/musician/:name', function(req, res) {

   // Get /musician/Matt
   console.log(req.params.name)
   // => Matt

   res.send('{"id": 1,"name":"Matt",
     "band":"BBQ Brawlers"}');
});