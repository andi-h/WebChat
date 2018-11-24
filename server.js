/*** config ***/
var port = 8081;
var ws_time_port = 8082;
var ws_data_port = 8083;

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
    ws.on('message', function incoming(message) {
        console.log('received on port %s: %s', ws_data_port, message);

        // Broadcast to everyone else
        data_wss.clients.forEach(function each(client) {
            client.send(message);
        });
    });

    console.log('new Websocket connection on port %s ...', ws_data_port);
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
