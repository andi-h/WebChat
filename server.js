/*** config ***/
var port = 8081;
var ws_port = 8082;

/*** start websocket server ***/
const websocket = require('ws');
const wss = new websocket.Server({port: ws_port});

wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        console.log('received: %s', message)
    })

    console.log('new Websocket connection on port %s ...', ws_port);
    setInterval(
        () => ws.send(`${new Date()}`),
        1000
    )
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
