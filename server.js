var path = require('path');
var express= require('express'); 
var app = express(); 
var server = require('http').Server(app); 
var io = require('socket.io')(server); 

server.listen(1337, function () {
	console.log('The server is listening on port 1337!');
});

app.use(express.static(path.join(__dirname, 'browser')));

app.get('/', function (req, res) {

	res.sendFile(path.join(__dirname, 'index.html'));
});

var drawings= []; 

io.on('connection',function(socket){
	socket.emit('drawAll', drawings)
	console.log("A new client has connnected."); 
	socket.on('disconnect',function(){
		console.log("Client has disconnected"); 
	})
	socket.on('draw',function(start,end,strokeColor){
		console.log("server sees drawing"); 
		// console.log(start,end,strokeColor);
		drawings.push([start,end,strokeColor,false]); 

		socket.broadcast.emit('draw',start,end,strokeColor); 
	})
	socket.on('clear',function(){
		console.log("server clear"); 
		socket.emit('clearAll',drawings); 
		socket.broadcast.emit('clearAll',drawings); 
		drawings = []; 
	})
})
