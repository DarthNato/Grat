var express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var mongoose = require('mongoose');
var app = express();
var _ = require('./config.js');

//models
var User = require('./models/user.js');

//Server init
//heroku's automatic port, or default
var port = process.env.PORT || _.appLocalPort;
var server = app.listen(port, function () {
  console.log("This App listening on "+port);
});

//DB handling
//heroku's automatic uri, or local host
var databaseLink = process.env.MONGODB_URI || _.appLocalMongoUrl;
mongoose.connect(databaseLink);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () { 
	console.log("connected to "+databaseLink);
});


//Everything gets here.
app.use(function (req,res,next){
	//we should handle autorization here for every request. // or use an express auth middleware.
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

	//Right now, we are just updating the whole how_to_grat object. Overwriting any existing value!! (we may want to change this in the future).
	User.update({'_id':req.params.id}, { $set: {'how_to_grat':req.body} }, function (err, user){
		if (err) next(err);
		else res.send("Promo config for User "+req.params.id+" updated");
	});
});

//Create and return the transactions to be forwarded to the payment server, or to be approved by the provider.
app.get('/new_transaction', function (req, res, next){
	//TODO, Make sure new transactions are only created for users on their own behalf.
	User.findById(req.body.customer, function (err, customer){
		if (err) next(err);
		if (customer) {
			User.findById(req.body.provider, function (err, provider){
				if (err) next(err);
				if (provider) {
					var transaction = buildTransaction(customer, provider, req.body.amount);

					//TODO, This response should be signed to guarantee that grat server created it, Client will send this transaction
					//to the payment verification service (electronic payments, or provider directly) to accept it.
					//We will recibe then from the payment verification service the commit for the transaction (if approved).
					if (transaction) res.send(transaction);
					else res.sendStatus(400);
				}
				else res.sendStatus(404); //provider not found
			});
		}
		else res.sendStatus(404); //user not found
	});
});

//Build the transactions to be forwarded to the payment server, or to be approved by the provider.
buildTransaction = function (customer, provider, amount){
	var resTrans={
		original_amount: amount,
		customer:customer._id,
		provider:provider._id
	};
	var newToProvider = false;
	if (!_.isArray(customer.contact_history))
		newToProvider = true;
	else {
		//find an entry in the customer contact_history that matches the provider as the vendor id.
		var customerProviderHistory = customer.contact_history.find(function(){ return this.vendor_id==provider._id});
		if (customerProviderHistory == undefined)
			newToProvider = true;
	}
	if (newToProvider){
		//New customer promo
		resTrans.reward_amount = provider.how_to_grat.new_customer ? provider.how_to_grat.new_customer : 0;
		resTrans.paied_amount = Math.max(0, resTrans.original_amount-resTrans.reward_amount );
		resTrans.transaction_count = 0; //new to provider, means we dont have any transactions yet.
		if (provider.how_to_grat.by_visits.with_minimun){
			//provider has a by visits promo
			resTrans.to_next_visit_promo = provider.how_to_grat.by_visits.for_every;
			if (resTrans.paied_amount >= provider.how_to_grat.by_visits.with_minimun)
				resTrans.to_next_visit_promo--;
		}
		if (provider.how_to_grat.by_spending.when_spent){
			//provider has a by spending promo
			resTrans.to_next_spent_promo = provider.how_to_grat.by_spending.when_spent - resTrans.paied_amount;
		}

	} else {
		//TODO other promos for existing customers
	} 

	return resTrans;
};

exports.closeServer = function (){
  server.close();
};