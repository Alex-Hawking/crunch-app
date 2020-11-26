var socket = io();

var validCode = false;

//Code Validation

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

//Join Room

function joinRoom(code, name) {
    $('#loginModal').css('display', 'none');
    $('#roomNumber').text(code);
    $('#username').text(name);
}

//Request to join

function joinRequest() {
    if ($('#usernameInput').val().length > 0 && validCode) {
        var code = $('#codeInput').val();
        var name = $('#usernameInput').val();
        socket.emit('join-room', { room: code, username: name }, (joined) => {
            if (joined) {
                joinRoom(code, name);
            } else {
                alert('Failed To Connect')
            }
        });
    } else {
        alert('Please Enter A Valid Code And/Or Username!');
    }
}

//Create Room 

function createRoom() {
    var name = $('#usernameInput').val();
    socket.emit('create-room', (code) => {
        socket.emit('join-room', { room: code, username: name }, (joined) => {
            if (joined) {
                joinRoom(code, name);
            } else {
                alert('Failed To Connect')
            }
        });
    })
}

//Send Messages

function sendMessage() {
    socket.emit('message', $('#messageText').val(), (sent) => {
        if (sent) {
            $('#messages').append(`<li><b>You </b>${$('#messageText').val()}</li>`);
            $('#messageText').val('');
        }
    });
}


$('#joinRoom').click(() => {
    joinRequest();
});

$('#codeInput').keypress((e) => {
    if (e.key === "Enter") {
        $('#usernameInput').focus();
    }
});

$('#usernameInput').keypress((e) => {
    if (e.key === "Enter" && $('#codeInput').val()) {
        joinRequest();
    } else if (e.key === "Enter" && $('#usernameInput').val()) {
        //createRoomFunction
    }
});


$('#createRoom').click(() => {
    if ($('#usernameInput').val().length > 0) {
        createRoom();
    } else {
        alert('Please Enter A Username');
    }
})

$('#leaveRoom').click(() => {
    location.reload();
})

socket.on('update-users', (users) => {
    $('#currentMembers').empty();
    users.forEach(user => $('#currentMembers').append(`<li>${user}</li>`));
});

$('#sendMessage').on('click', () => {
    sendMessage();
})

$('#messageText').keypress((e) => {
    if (e.key === "Enter") {
        sendMessage();
    }
});

socket.on('message', (content) => {
    $('#messages').append(`<li><b>${content.bold} </b>${content.std}</li>`);
    $('#messages').scrollTop($('#messages')[0].scrollHeight - $('#messages')[0].clientHeight);
});