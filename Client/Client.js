const socket = io.connect('http://localhost:3000');

socket.on('event', function (data) {
    console.log('Server\'s event' + data);
    //socket.emit('my other event', { my: 'data' });
});
socket.emit('client event', {first:'responce'});


console.log('It\'s a external script');

//let socket = io.connect(localhost);
