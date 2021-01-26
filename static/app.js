var socket = io();

var validCode = false;
var messages = document.getElementById('messages')

$(window).on('load', () => {
    $('#preloader').fadeOut('slow');
});

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

function toggleUsers() {
    $('#currentMembers').toggle('fast', 'swing')
}

function autoScroll() {
    var messages = document.getElementById('messageContainer')
    $("#messageContainer").scrollTop(messages.scrollHeight)
}

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
    if ($('#messageText').val().length) {

        //Chatbot
        if ($('#messageText').val().charAt(0) == '!') {
            var command = $('#messageText').val().substring(1)
            console.log(command.substring(0, 5))
            $('#messages').append(`<li><span id="messageSent">You</span>` + (` ${$('#messageText').val()}`).replace(/</g, '&lt;') + `</li>`);
            if (command == 'help') {
                $('#messages').append(`<li><span id="bot">Bot</span> ` + 'Try the following commands:<br><b>!members</b>: lists chat members<br><b>!leave</b>: leave the room<br><b>!clear</b>: clears chat history from your device<br><b>!room</b>: displays the current room number<br><b>!username</b>: displays your current handle<br><b>!help</b>: reveals this message</li>');
            } else if (command == 'members') {
                var members = $('#currentMembers>li').toArray().map(item => $(item).html());
                var message = `<li><span id="bot">Bot</span> This chat has <b>${members.length}</b> member/s:`
                for (var member in members) {
                    message = message + `<br><i>${members[member]}<i>`
                }
                console.log(message)
                $('#messages').append(message + '</li>');

            } else if (command == 'leave') {
                location.reload();
            } else if (command == 'room') {
                $('#messages').append(`<li><span id="bot">Bot</span> You are in room <b>${$('#roomNumber').text()}</b>.</li>`);
            } else if (command == 'username') {
                $('#messages').append(`<li><span id="bot">Bot</span> Your current handle is <b>${$('#username').text()}</b>.</li>`);
            } else if (command == 'clear') {
                $('#messages').empty()
                $('#messages').append(`<li><span id="bot">Bot</span> Chat cleared.</li>`);
            } else if (command.substring(0, 4) == 'link') {
                var link = command.substring(5, command.length)
                socket.emit('link', link, (sent) => {
                    if (sent) {
                        $('#messages').append(`<li><span id="bot">Bot</span >Sent link: <a href="${link}" target="_blank">${link}</a>.</li>`);
                        $('#messages').append(`<li><span id="messageSent">You</span> <a href="${link}" target="_blank">${link}</a></li>`);
                        $('#messageText').val('');
                        autoScroll()
                    }
                })
            } else if (command.substring(0, 5) == 'image') {
                var imageLink = command.substring(6, command.length)
                if (imageLink.match(/\.(jpeg|jpg|gif|png)$/) != null) {
                    socket.emit('image', imageLink, (sent) => {
                        if (sent) {
                            $('#messages').append(`<li><span id="bot">Bot</span> Sent image: <a href="${imageLink}" target="_blank">${imageLink}</a>.</li>`);
                            $('#messages').append(`<li><span id="messageSent">You</span><br><img src="${imageLink}" style="max-width: 90%; height: auto;">`);
                            $('#messageText').val('');
                            autoScroll()
                        }
                    })
                } else {
                    $('#messages').append(`<li><span id="bot">Bot</span> Please enter a valid image link.</li>`);
                }

            } else if (command == 'hi' || command == 'hey' || command == 'hello') {
                $('#messages').append(`<li><span id="bot">Bot</span> Hello.</li>`);
            } else if (command == 'joke') {
                $('#messages').append(`<li><span id="bot">Bot</span> You are the joke.</li>`);
            } else {
                $('#messages').append(`<li><span id="bot">Bot</span> ` + 'Unrecognised command! Please try again (use !help for help).</li>');
            }

            $('#messageText').val('');
            autoScroll()
        } else {
            socket.emit('message', $('#messageText').val().toString(), (sent) => {
                if (sent) {
                    $('#messages').append(`<li><span id="messageSent">You</span>` + (` ${$('#messageText').val()}`).replace(/</g, '&lt;') + `</li>`);
                    $('#messageText').val('');
                    autoScroll()
                }

            });
        }
    }
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
    $('#messages').append(`<li><span id="messageReceived">${content.bold}</span> ` + (` ${content.std}`).replace(/</g, '&lt;') + `</li`);
    autoScroll()
});

socket.on('link', (content) => {
    $('#messages').append(`<li><span id="messageReceived">${content.bold}</span> <a href="${content.link}" target="_blank">${content.link}</a></li>`);
    autoScroll()
});

socket.on('image', (content) => {
    $('#messages').append(`<li><span id="messageReceived">${content.bold}</span><br><img src="${content.link}" style="max-width: 90%; height: auto;">`);
    autoScroll()
});