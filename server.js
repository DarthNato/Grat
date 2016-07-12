var express = require('express');
var app = express();

app.use(function(req,res,next){
	//we should handle autorization here for every request.
	if (true)
		next();
	else
		res.send(401);
});

app.get('/', function (req, res) {
	res.send('Hello World!! =D');
})
var port = process.env.PORT || 8000;
var server = app.listen(port, function () {
  console.log("This App listening on "+port);
});

exports.closeServer = function(){
  server.close();
};