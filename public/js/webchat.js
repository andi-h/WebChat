function send_message()
{
    var message_input = document.querySelector("#message").value;
    var name_input = document.querySelector("#name").value;

    var msg = {
        message: message_input,
        name: name_input
    };

    data_ws.send(JSON.stringify(msg));

    document.querySelector("#message").value = '';
}

function receive_message(msg)
{
    var message_box = document.getElementById('message-box');
    
    message_box.innerHTML += '<p>' + msg.name + ': ' + msg.message + '</p>';
    message_box.scrollTop = message_box.scrollHeight;
}