var socket = io();

var validCode = false;

$('#codeInput').keyup(() => {
    if ($('#codeInput').val().length == 4) {
        socket.emit('check-room', $('#codeInput').val(), (codeIsValid) => {
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
        var code = $('#codeInput').val();
        var name = $('#usernameInput').val();
        socket.emit('join-room', { room: code, username: name }, (joined) => {
            if (joined) {
                $('#loginModal').css('display', 'none');
                $('#roomNumber').text(code);
                $('#username').text(name);
            }
        });
    } else {
        alert('Please Enter A Valid Code And/Or Username!');
    }
});

socket.on('update-users', (users) => {
    $('#currentMembers').empty();
    users.forEach(user => $('#currentMembers').append(`<li>${user}</li>`));
});

$('#sendMessage').on('click', () => {
    socket.emit('message', $('#messageText').val(), (sent) => {
        if (sent) {
            $('#messages').append(`<li><b>You </b>${$('#messageText').val()}</li>`);
            $('#messageText').val('');
        }
    });
})

socket.on('message', (content) => {
    $('#messages').append(`<li><b>${content.bold} </b>${content.std}</li>`)
});