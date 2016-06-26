var express = require('express');
var app = express();

app.get('/', function (req, res) {
   res.send('Hello World!! :D');
})

var server = app.listen(8000, function () {
  console.log("This App listening at port 8000");
})