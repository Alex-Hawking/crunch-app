var socket = io();

//Check Room
$('#input').keyup(function(e) {
    if ($('#input').val().length == 4) {
        socket.emit('room-check', $('#input').val());
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
})