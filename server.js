const express = require('express');
const app = express();
const server = require('http').createServer(app).listen(3000);
const sql = require('msnodesqlv8');//msnodesqlv8
const io = require('socket.io')(server);
//require('./logic');




app.get('/', function (req, res) {
    res.sendFile(__dirname + '/Client/interface.html');
});

app.get('/newGame', function (req, res) {
    res.sendFile(__dirname + '/Client/Game.html');
});

app.get('/repo', function (req, res) {
    res.sendFile(__dirname + '/Client/logInfo.html');
});



app.get('/test',(req,res)=>{
    res.send({msg:'hello'});
});

/*app.post('/test', (req, res)=>{
console.log('Пришел ПОСТ');
res.send('Proverka');
});*/

app.use(express.static(__dirname + '/Client'));




const connectionString = 'Driver={SQL Server Native Client 11.0}; Server=np:\\\\.\\pipe\\MSSQL$SQLEXPRESS\\sql\\query; Database={GameDB}; Trusted_Connection=Yes;';
const query = 'SELECT * FROM Robots WHERE Name_of_type = \'Heavy robot\'';
/*''SELECT Quantity_energy_on_step, Def_bonus FROM Texture WHERE Title = \'Mount\''*/

function generateMapMount (){
    sql.open(connectionString, function (err, con) {
        if (err) {
            console.log('failed to open ' + err.message);
            return
        }

        con.query('SELECT Quantity_energy_on_step, Def_bonus, Texture_link FROM Texture WHERE Title = \'Mount\'', function (err, rows) {
            if (err) {
                console.log(err.message);
                return
            }
            //console.log(rows);
            return rows;
        })
    });
} //Почему-то не возвращает результат


io.sockets.on('connection', (socket)=>{
    console.log('connect');
    socket.on('generateMapMount', (pos)=>{
//Запрос на текстуры
        sql.open(connectionString, function (err, con) {
            if (err) {
                console.log('failed to open ' + err.message);
                return
            }

            con.query('SELECT Quantity_energy_on_step, Def_bonus, Texture_link FROM Texture WHERE Title = \'Mount\'', function (err, rows) {
                if (err) {
                    console.log(err.message);
                    return
                }
                //console.log(rows);
                io.sockets.emit('acceptedTextureMount', {texture:rows[0].Texture_link});
            })
        });

        //io.sockets.emit('acceptedTextureMount', {texture:/*mount.Texture_link*/3});
    });



    /*socket.on('report', (data)=> {
        console.log('report is come in');
        console.log(data);
        sql.open(connectionString, function (err, con) {
            if (err) {
                console.log('failed to open ' + err.message);
                return
            }

            con.query('SELECT * FROM ActionInRound WHERE Battle_ID = '+data.id, function (err, rows) {
                if (err) {
                    console.log(err.message);
                    return
                }
                console.log(rows);
                socket.emit('serverRepo', {data:rows});
            })
        });

    });*/

});





/*sql.open(connectionString, function (err, con) {
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
});*/

