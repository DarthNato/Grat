var express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var mongoose = require('mongoose');
var app = express();

//models
var User = require('./models/user.js');

//Server init
//heroku's automatic port, or 8000
var port = process.env.PORT || 4000;
var server = app.listen(port, function () {
  console.log("This App listening on "+port);
});

//DB handling
//heroku's automatic uri, or local host
var databaseLink = process.env.MONGODB_URI || 'mongodb://localhost/grat';
mongoose.connect(databaseLink);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () { 
	console.log("connected to "+databaseLink);
});


//Everything gets here.
app.use(function (req,res,next){
	//we should handle autorization here for every request. // or use an express auth middelware.
	if (true)
		next();
	else
		res.sendStatus(401);
});
app.use(jsonParser); //Parse the body middleware
app.use(function (err,req,res,next){
	//TODO Better handle errors
	console.error(err.stack);
	res.sendStatus(500);
});

//Base url
app.get('/', function (req, res) {
	res.send('Hello World!! =D');
})

//Basic User handling
app.post('/user', function (req, res, next) {
	//we may want to make some meaningful validations to the user here.
	if (req.body.user_name==undefined)  {next()};

	user = new User(req.body);
	//init contact_history as empty and prevent injection from the client.
	user.contact_history=[];
	user.save(function (err, user){
		if (err) next();
		else res.send(user);
	});
});
app.get('/user/:id', function (req, res, next) {
	//TODO: authorization function should give us the information of the requester user.
	//If the requester user is the user him/herself, return the whole object, Otherwise dont return its contact_history

	User.findById(req.params.id, function (err, user){
		if (err) next(err);
		if (user) res.send(user);
		else res.sendStatus(404); //user not found
	});
});
app.put('/user/:id', function (req, res, next) {
	//TODO: authorization function should give us the information of the requester user.
	//We can only update our own user, except for contact_history

	if (req.body.contact_history != undefined) delete req.body.contact_history;

	User.update({'_id':req.params.id}, { $set: req.body }, function (err, user){
		if (err) next(err);
		else res.send("User "+req.params.id+" updated");
	});
});
app.delete('/user/:id', function (req, res, next) {
	//TODO: authorization function should give us the information of the requester user.
	//We can only delete our own user.
	if (req.params.id){
		User.findByIdAndRemove(req.params.id, function (err, user){
			if (err) next(err);
			else res.send(user);
		});
	} else res.sendStatus(400);
	
});

//Promo configuration
app.put('/user/:id/how_to_grat', function (req, res, next){
	//TODO: authorization function should give us the information of the requester user.
	//We can only update our own user, except for contact_history

	//Right now, we are just updating the whole object. Overwriting any existing value!! (we may want to change this in the future).
	User.update({'_id':req.params.id}, { $set: {'how_to_grat':req.body} }, function (err, user){
		if (err) next(err);
		else res.send("Promo config for User "+req.params.id+" updated");
	});
});

exports.closeServer = function (){
  server.close();
};