var ws = new WebSocket('ws://localhost:8082');

ws.onopen = function () {
    console.log('websocket is connected ...');
}

ws.onmessage = function (message) {
    document.getElementById('date').innerHTML = message.data;
}