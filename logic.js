const sql = require('msnodesqlv8');//msnodesqlv8
const io = require('socket.io')(server);

console.log('It\'s a logic file');

const connectionString = 'Driver={SQL Server Native Client 11.0}; Server=np:\\\\.\\pipe\\MSSQL$SQLEXPRESS\\sql\\query; Database={GameDB}; Trusted_Connection=Yes;';
const query = 'SELECT * FROM Robots';


io.sockets.on('generateMapMount', function(){

});



/*io.sockets.on('connection', function(socket){
    console.log('Server run!');
    socket.emit('event', {new:'dat'});
    socket.on('client event', function(data){
        console.log(data);
    });
});*/



sql.open(connectionString, function (err, con) {
    if (err) {
        console.log('failed to open ' + err.message);
        return
    }

    con.query(query, function (err, rows) {
        if (err) {
            console.log(err.message);
            return
        }
        console.log(rows[2].Name_of_type);
    })
});