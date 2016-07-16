var express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var mongoose = require('mongoose');
var app = express();

//models
var User = require('./models/user.js');

//Server init
//heroku's automatic port, or 8000
var port = process.env.PORT || 8000;
var server = app.listen(port, function () {
  console.log("This App listening on "+port);
});

//DB handling
//heroku's automatic uri, or local host
var databaseLink = process.env.MONGOLAB_URI || 'mongodb://localhost/grat';
mongoose.connect(databaseLink);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() { 
	console.log("connected to "+databaseLink);
});


//Everything gets here.
app.use(function(req,res,next){
	//we should handle autorization here for every request. // or use express auth.
	if (true)
		next();
	else
		res.sendStatus(401);
});
app.use(jsonParser); //Parse the body middleware

//Base url
app.get('/', function (req, res) {
	res.send('Hello World!! =D');
})

//User handling
app.post('/user', function (req, res) {
	//we may want to make some meaningful validations to the user here.
	console.log(req.body);
	if (req.body.user_name==undefined)  return res.sendStatus(400);

	user = new User(req.body);
	//init contact_history as empty and prevent injection from the client.
	user.contact_history=[];
	user.save(function(err, user){
		if (err) res.send(err);
		else res.send(user);
	});
});

exports.closeServer = function(){
  server.close();
};