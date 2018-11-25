/*** config ***/
var port = 80;
var ws_time_port = 8082;
var ws_data_port = 8083;

/*** connect to MySQL database ***/
var mysql = require('mysql'); 

var db_con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root"
  });
  
  db_con.connect(function(err) {
    if (err) throw err;
    console.log("Connected to MySQL database.");
    db_con.query("CREATE DATABASE IF NOT EXISTS webchat;", function (err, result) {
        if (err) throw err;
        console.log("Create new Database if not exists.");

        db_con = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "root",
            database: "webchat"
        });

        db_con.query("CREATE TABLE IF NOT EXISTS messages ("
                   + "id int(11) unsigned NOT NULL auto_increment,"
                   + "name varchar(255) NOT NULL default '',"
                   + "message varchar(255) NOT NULL default '',"
                   + "PRIMARY KEY (id));", function (err, result) {
            if (err) throw err;
            console.log("Create new Table if not exists.");
        });
    });
  });

/*** start time websocket server ***/
const websocket = require('ws');
const time_wss = new websocket.Server({port: ws_time_port});

time_wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        console.log('received on port %s: %s', ws_time_port, message);
    });

    console.log('new Websocket connection on port %s ...', ws_time_port);
    setInterval(
        () => ws.send(`${new Date()}`),
        1000
    )
})

/*** start data websocket server ***/
const data_wss = new websocket.Server({port: ws_data_port});

data_wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(msg) {
        console.log('received on port %s: %s', ws_data_port, msg);

        var _msg = JSON.parse(msg);
        var _type = _msg.type;
        var _name = _msg.name;
        var _message = _msg.message;

        switch(_type)
        {
            case 'clear_all':
                // Truncate Table
                db_con.query("TRUNCATE TABLE messages;", function (err, result) {
                    if (err) throw err;
                    console.log("All messages cleared.");
                });   
                
                // Broadcast to everyone
                data_wss.clients.forEach(function each(client) {
                    client.send(JSON.stringify({type: 'clear_all'}));
                });
                break;

            case 'message':
                // Save in Database
                db_con.query("INSERT INTO messages (name, message)"
                           + "VALUES ('" + _name + "','" + _message + "');", function (err, result) {
                    if (err) throw err;
                    console.log("Message saved in Database.");
                });    

                // Broadcast to everyone
                data_wss.clients.forEach(function each(client) {
                    client.send('[' + msg + ']');
                });
                break;

            default:
                console.log("Received undefined message type.")
        }                       
    });

    console.log('new Websocket connection on port %s ...', ws_data_port);

    db_con.query("SELECT name, message from messages;", function (err, result) {
        if (err) throw err;
        ws.send(JSON.stringify(result));
    }); 
})

/*** start Webserver and provide static index.html ***/
var express = require('express');
var app = express();

app.use(express.static('public'));

app.get('/', function (request, response) {
    response.send('No index.html file found.');
})

var server = app.listen(port, function () {
   console.log("Webserver listening on port %s ...", port)
})
