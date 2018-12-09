const express = require('express');
const app = express();
const server = require('http').createServer(app).listen(3000);
const io = require('socket.io')(server);

//require('./logic');



app.get('/', function (req, res) {
    res.sendFile(__dirname + '/Client/interface.html');
});

app.get('/newGame', function (req, res) {
    res.sendFile(__dirname + '/Client/index.html');
});






app.use(express.static(__dirname + '/Client'));