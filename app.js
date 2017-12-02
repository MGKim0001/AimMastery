
var express = require("express");
var app = express();

var server  = app.listen(8080);
var io = require('socket.io').listen(server);


app.use(express.static(__dirname + '/src'));
app.get('/', function(req, res){
    res.render('index');
});

//console.log("Listening on http://aimmaster.bluemix.net:8080" );
console.log("Listening on http://localhost:8080" );

io.on('connection', function(socket){
  console.log('a user connected');
});
