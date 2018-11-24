var time_ws = new WebSocket('ws://localhost:8082');

time_ws.onopen = function () {
    console.log('time websocket is connected ...');
}

time_ws.onmessage = function (message) {
    document.getElementById('date').innerHTML = message.data;
}

var data_ws = new WebSocket('ws://localhost:8083');

data_ws.onopen = function () {
    console.log('data websocket is connected ...');
}

data_ws.onmessage = function (message) {
    console.log('new message: %s', message.data)
    
    receive_message(JSON.parse(message.data));
}