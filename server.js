var path = require('path');
var express= require('express'); 
var app = express(); 
var server = require('http').Server(app); 
var io = require('socket.io')(server); 
var bodyparser = require('body-parser');

server.listen(1337, function () {
});
app.use(bodyparser.urlencoded({extended:false}))
app.use(express.static(path.join(__dirname, 'browser')));


app.get('/', function (req, res) {


	res.sendFile(path.join(__dirname, 'index.html'));
});

var drawings= {}; 
var nsps = {};

app.get('/:room', function (req, res){
	var room = '/'+req.params.room.toString();
	drawings[room] = drawings[room] || [];
	res.sendFile(path.join(__dirname, 'index.html'));
	nsps[room] = nsps[room] || io.of(room);
	nsps[room].on('connection',function(socket){
		socket.broadcast.emit('drawAll', drawings[room]);
		socket.emit('drawAll', drawings[room]);
		socket.on('disconnect',function(){
		})
		socket.on('draw',function(start,end,strokeColor){
			drawings[room].push([start,end,strokeColor,false]); 
			socket.broadcast.emit('draw',start,end,strokeColor,false); 
		})
		socket.on('clear',function(){
			socket.emit('clearAll',drawings[room]); 
			socket.broadcast.emit('clearAll',drawings[room]); 
			drawings[room] = []; 
		})
	})
})

