var socket = io();

$('#codeInput').keyup(() => {
    if ($('#codeInput').val().length == 4) {
        socket.emit('check-room', $('#codeInput').val(), function(codeIsValid) {
            if (codeIsValid) {
                $('#codeValidator').text('Code Is Valid');
                $('#codeValidator').css('color', 'green');
            } else {
                $('#codeValidator').text('Please Enter A Valid Code');
                $('#codeValidator').css('color', 'red');
            }
        })
    } else {
        $('#codeValidator').text('Please Enter A Valid Code');
        $('#codeValidator').css('color', 'red');
    }
})