const express = require('express');
const app = express();
const server = require('http').createServer(app).listen(3000);
const sql = require('msnodesqlv8');//msnodesqlv8
const io = require('socket.io')(server);
const bodyParser = require('body-parser');
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


//Запросы на данные

const connectionString = 'Driver={SQL Server Native Client 11.0}; Server=np:\\\\.\\pipe\\MSSQL$SQLEXPRESS\\sql\\query; Database={GameDB}; Trusted_Connection=Yes;';

function getTexture(titleTexture){
    sql.open(connectionString, function (err, con) {
        if (err) {
            console.log('failed to open ' + err.message);
            return
        }

        con.query(`SELECT Quantity_energy_on_step, Def_bonus, Texture_link FROM Texture WHERE Title = ${titleTexture}`, function (err, rows) {
            if (err) {
                console.log(err.message);
                return
            }
            //console.log(rows);
            return rows;
            //res.send(rows);
        })
    });
}

app.get('/getRobot',(req,res)=>{ //Текстуры Robot
    //res.send(getTexture('Mount'));
    sql.open(connectionString, function (err, con) {
        if (err) {
            console.log('failed to open ' + err.message);
            return
        }

        con.query('SELECT Full_HP, Full_energy, Texture_link FROM Robots WHERE Name_of_type = \'Medium robot\'', function (err, rows) {
            if (err) {
                console.log(err.message);
                return
            }
            //console.log(rows);
            //return rows;
            res.send(rows);
        })
    });

    //res.send({msg:'hello'});
});

app.get('/getPlain',(req,res)=> { //Текстуры Mount
    //res.send(getTexture('Plain'));
    sql.open(connectionString, function (err, con) {
        if (err) {
            console.log('failed to open ' + err.message);
            return
        }

        con.query('SELECT Quantity_energy_on_step, Def_bonus, Texture_link FROM Texture WHERE Title = \'Plain\'', function (err, rows) {
            if (err) {
                console.log(err.message);
                return
            }
            //console.log(rows);
            //return rows;
            res.send(rows);
        })
    });
});


app.get('/getMount',(req,res)=>{ //Текстуры Mount
    //res.send(getTexture('Mount'));
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
            //return rows;
            res.send(rows);
        })
    });

    //res.send({msg:'hello'});
});

app.get('/getForest',(req,res)=>{
    sql.open(connectionString, function (err, con) {
        if (err) {
            console.log('failed to open ' + err.message);
            return
        }

        con.query('SELECT Quantity_energy_on_step, Def_bonus, Texture_link FROM Texture WHERE Title = \'Forest\'', function (err, rows) {
            if (err) {
                console.log(err.message);
                return
            }
            //console.log(rows);
            //return rows;
            res.send(rows);
        })
    });
});

app.use(bodyParser.json());

app.post('/getInf',(req, res) => {
    console.log(req.body);

    sql.open(connectionString, function (err, con) {
        if (err) {
            console.log('failed to open ' + err.message);
            return
        }

        con.query(`INSERT ActionInRound (Battle_ID, Robot_ID, Quantity_HP, Quantity_energy, PositionX,PositionY)  
            VALUES (\'1\', \'${req.body.id}\', ${req.body.hp}, ${req.body.energy}, ${req.body.x}, ${req.body.y})`, function (err) {
            if (err) {
                console.log(err.message);
                //return
            }
            //console.log(rows);
            //return rows;
            //res.send(rows);
        })
    });


});


app.post('/getTextureMountain',(req, res) => {
    console.log(req.body);

    sql.open(connectionString, function (err, con) {
        if (err) {
            console.log('failed to open ' + err.message);
            return
        }

        con.query(`UPDATE BattleMap SET Texture_ID = ${req.body.textureID} WHERE Square_number = ${req.body.i*10 + req.body.j}`, function (err) {
            if (err) {
                console.log(err.message);
                //return
            }
            //console.log(rows);
            //return rows;
            //res.send(rows);
        })
    });


});

app.post('/getTextureForest',(req, res) => {
    console.log(req.body);

  /*  sql.open(connectionString, function (err, con) {
        if (err) {
            console.log('failed to open ' + err.message);
            return
        }

        con.query(`UPDATE BattleMap SET Texture_ID = ${req.body.textureID} WHERE Square_number = ${req.body.i*10 + req.body.j}`, function (err) {
            if (err) {
                console.log(err.message);
                //return
            }
            //console.log(rows);
            //return rows;
            //res.send(rows);
        });
        con.close();
    });*/


});

app.post('/getTexturePlain',(req, res) => {
    console.log(req.body);

    sql.open(connectionString, function (err, con) {
        if (err) {
            console.log('failed to open ' + err.message);
            return
        }

        con.query(`UPDATE BattleMap SET Texture_ID = ${req.body.textureID} WHERE Square_number = ${req.body.i*10 + req.body.j}`, function (err) {
            if (err) {
                console.log(err.message);
                //return
            }
            //console.log(rows);
            //return rows;
            //res.send(rows);
        })
    });


});



app.use(express.static(__dirname + '/Client'));




//const connectionString = 'Driver={SQL Server Native Client 11.0}; Server=np:\\\\.\\pipe\\MSSQL$SQLEXPRESS\\sql\\query; Database={GameDB}; Trusted_Connection=Yes;';
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

