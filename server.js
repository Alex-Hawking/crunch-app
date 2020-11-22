var express = require('express');
var app = express();

var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/static'));

var rooms = [];

function createRoom(code) {
    rooms.push({ code: code, users: [] })
}

createRoom('1234')
createRoom('4321')
createRoom('1111')

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/static/index.html');
});

http.listen(3000, () => {
    console.log('Server Started On :*3000');
});

io.on('connection', (socket) => {
    console.log('a user connected');

    //Check If Room Exists
    socket.on('room-check', (code) => {
        if (rooms.map(room => room.code).includes(code)) {
            socket.emit('room-check', true);
            console.log('true');
        } else {
            socket.emit('room-check', false);
            console.log('false')
        }
    });

    socket.on('join-room', (info) => {
        rooms[rooms.findIndex(room => room.code == info.code)].users.push(info.name);
        socket.join(info.code);
        console.log(rooms)
    })

    socket.on('message', (data) => {
        console.log(data.user)
        io.to(data.room).emit('message', 'From ' + data.user + ' : ' + data.message)
    })
});