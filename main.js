var express = require('express');
var app = express();

app.get('/', function (req, res) {
   res.send('Hello World!! :D');
})
var port = process.env.PORT || 8000;
var server = app.listen(port, function () {
  console.log("This App listening");
})