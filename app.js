
var express = require("express");
var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);
http.listen(process.env.PORT || 8080);


var clientScore;

// for DB
var playerName;
var playerScore;


app.use(express.static(__dirname + '/src'));
app.get('/', function(req, res){
    res.render('index');
});

app.enable('trust proxy');
app.use (function (req, res, next) {
  if (req.secure) {
    res.redirect('http://' + req.headers.host + req.url);
  } else {
    next();
  }
});


console.log("Listening on http://localhost:8080" );

io.on('connection', function(socket){
  console.log('game.html connected');

// get score from client
socket.on('get score', function (data) {
    clientScore = data;
    console.log(clientScore);
});


socket.emit('send back score', clientScore);

socket.on('send back user and score', function (data) {
  console.log(data);
  playerName = data.userName;
  playerScore = data.score;

  //console.log(playerName);
  //console.log(playerScore);
  var updateInsert = mysql.format('INSERT INTO playerinfo (name,score) VALUES (?,?) ON DUPLICATE KEY UPDATE score = ?;',
                     [playerName,playerScore,playerScore]);
  console.log(updateInsert);
  connection.query(updateInsert, function(err, rows, fields) {
    if (!err){
      console.log('updateInsert succeed');
    }
    else{
      console.log('updateInsert failed');
    }
  });
});

var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : 'us-cdbr-sl-dfw-01.cleardb.net',
  user     : 'ba070863ada12a',
  password : '842187e6',
  database : 'ibmx_bc0c6d4f36d1fd1'
});


connection.connect(function(err){
  if(!err) {
    console.log("Database is connected ... nn");
  } else {
    console.log("Error connecting database ... nn");
  }
});

// CREATE table
connection.query('CREATE TABLE if not exists playerinfo (name VARCHAR(20), score INTEGER)', function(err, rows, fields) {
  if (!err){
    console.log('create table succeed');

    var setKey = mysql.format('AlERT TABLE playerinfo ADD PRIMARY KEY (?)', [playerName]);
    connection.query(setKey, function(err,rows,fields) {});
  }
  else{
    console.log('Error while create table.');
  }
});

var htmlTable = "";

function getTable(){
  connection.query('SELECT name,score from playerinfo WHERE 1=1 ORDER BY score DESC', function(err, rows, fields) {
    if (!err){
      console.log('print table succeed');
      //create HTML5
      for (var i in rows) {
        var temp = "<tr>" + "<td>" + rows[i].name + "</td>" + "<td>" + rows[i].score + "</td>" + "</tr>";
        htmlTable += temp;
      }

      //console.log(htmlTable);
      socket.emit('send scoreboard', htmlTable);
      connection.end();
    }
    else{
      console.log('Error while print table.');
    }
  });
}

getTable();

});
