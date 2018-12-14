const express = require('express');
const app = express();
const server = require('http').createServer(app).listen(3000);
const io = require('socket.io')(server);
const sql = require('msnodesqlv8');//msnodesqlv8
//require('./logic');  //Пересмотреть и переделать архитектуру




app.get('/', function (req, res) {
    res.sendFile(__dirname + '/Client/interface.html');
});

app.get('/newGame', function (req, res) {
    res.sendFile(__dirname + '/Client/Game.html');
});



app.use(express.static(__dirname + '/Client'));





const connectionString = 'Driver={SQL Server Native Client 11.0}; Server=np:\\\\.\\pipe\\MSSQL$SQLEXPRESS\\sql\\query; Database={GameDB}; Trusted_Connection=Yes;';
const query = 'SELECT * FROM Robots';


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