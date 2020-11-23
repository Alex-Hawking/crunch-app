var socket = io();

var validCode = false;

$('#codeInput').keyup(() => {
    if ($('#codeInput').val().length == 4) {
        socket.emit('check-room', $('#codeInput').val(), function(codeIsValid) {
            if (codeIsValid) {
                $('#codeValidator').text('Code Is Valid');
                $('#codeValidator').css('color', 'green');
                validCode = true;
            } else {
                $('#codeValidator').text('Please Enter A Valid Code');
                $('#codeValidator').css('color', 'red');
                validCode = false;
            }
        })
    } else {
        $('#codeValidator').text('Please Enter A Valid Code');
        $('#codeValidator').css('color', 'red');
        validCode = false;
    }
})

$('#joinRoom').click(() => {
    if ($('#usernameInput').val().length > 0 && validCode) {
        let code = $('#codeInput').val()
        let name = $('#usernameInput').val()
        socket.emit('join-room', { room: code, username: name });
    } else {
        alert('Please Enter A Valid Code And/Or Username!')
    }
})