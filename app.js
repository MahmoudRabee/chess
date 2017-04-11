var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server,{});
var Chess = require("./chess/server/ChessServer.js");
var ChessServer = new Chess.GameCoordinator();

app.use(express.static(__dirname + '/chess'));

io.on('connection', function(client) {
    console.log('Client connected...');
    //hand shake
    client.emit('connectionConfirmed');
    client.on('whichGame', function(){
        ChessServer.connect(client);
    });
});
server.listen(9000);

console.log("Server started.");
