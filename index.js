var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);


app.use(express.static(__dirname + '/public'));

var port = process.env.PORT || 5000;

var usernames = {};
var numUsers = 0;

io.on('connection', function(socket){
	var addedUser = false;

	socket.on('chat message', function(msg){
		socket.broadcast.emit('chat message', {
			username: socket.username,
			message: msg
		});
	});

	socket.on('add user', function(username){
		socket.username = username;

		usernames[username] = username;
		++numUsers;

		addedUser = true;
		socket.emit('login');

		socket.broadcast.emit('user joined', socket.username);
	});

	socket.on('disconnect', function(){
		if (addedUser){
			delete usernames[socket.username];
			--numUsers;

			socket.broadcast.emit('user left', socket.username);
		}
	});
});

http.listen(port, function(){
	console.log('listening on *:' + port);
});