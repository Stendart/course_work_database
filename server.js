const express = require('express');
const app = express();
const server = require('http').createServer(app).listen(3000);
const io = require('socket.io')(server);

app.use(express.static(__dirname + '/Client'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/Client/index.html');
});

io.sockets.on('connection', function(socket){
    console.log('Server run!');
    socket.emit('event', {new:'dat'});
    socket.on('client event', function(data){
       console.log(data);
    });
});