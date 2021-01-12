var socket = io();

var validCode = false;
var messages = document.getElementById('messages')

//Code Validation

$('#codeInput').keyup(() => {
    if ($('#codeInput').val().length == 4) {
        socket.emit('check-room', $('#codeInput').val(), (codeIsValid) => {
            if (codeIsValid) {
                $('#codeInput').css('color', '#4B7F52');
                validCode = true;
            } else {
                $('#codeInput').css('color', '#DA4B1B');
                validCode = false;
            }
        })
    } else {
        $('#codeInput').css('color', '#DA4B1B');
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
    socket.emit('message', $('#messageText').val().toString(), (sent) => {
        if (sent) {
            $('#messages').append(`<li>You ${$('#messageText').val()}</li>`);
            $('#messageContainer').scrollTop($('#messageContainer').scrollHeight);
            $('#messageText').val('');
        }
    });
}

function copyRoomNumber() {
    $("<textarea/>").appendTo("body").val(`${$('#roomNumber').text()}`).select().each(() => {
        document.execCommand('copy');
    }).remove();
    alert(`Copied room number: ${$('#roomNumber').text()}`)
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
    $('#messages').append(`<li>${content.bold} ${content.std}</li>`);
    $('#messages').scrollTop = $('#messages').height();
    console.log('scroll')
});

$(document).ready(() => {
    console.log('test')
        //$('#roomNumber').css('background', `${roomNumberColours[Math.floor((Math.random() * roomNumberColours.length))]}`)
})