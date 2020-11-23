var socket = io();

$('#codeInput').keyup(() => {
    if ($('#codeInput').val().length == 4) {
        socket.emit('check-room', $('#codeInput').val(), function(valid) {
            if (valid) {
                $('#codeValidator').text('Code Is Valid')
            } else {
                $('#codeValidator').text('Please Enter A Valid Code')
            }
        })
    } else {
        $('#codeValidator').text('Please Enter A Valid Code');
    }
})