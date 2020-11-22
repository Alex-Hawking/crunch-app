var socket = io();
var code = null;
var name = null;

//Check Room
$('#room-input').keyup(function(e) {
    if ($('#room-input').val().length == 4) {
        socket.emit('room-check', $('#room-input').val());
    } else {
        $('#room-check').text('Room Does Not Exist');
    }
});
socket.on('room-check', function(check) {
    console.log(check)
    if (check) {
        $('#room-check').text('Room Does Exist');
    } else {
        $('#room-check').text('Room Does Not Exist');
    }
});

//Join Room
$('#join-room').submit(function(e) {
    e.preventDefault();
    socket.emit('join-room', { code: $('#room-input').val(), name: $('#name-input').val() });
    $('#room-input').val('');
    $('#name-input').val('');
    return false;
});