var express = require('express');
var app = express();

var http = require('http').createServer(app);
var io = require('socket.io')(http);

var rooms = [
    { code: '1111', users: [] },
    { code: '1234', users: [] }
];

app.use(express.static(__dirname + '/static'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/static/index.html');
});

http.listen(3000, () => {
    console.log('Server Started On :*3000');
});

io.on('connection', (socket) => {
    socket.on('check-room', (code, callback) => {
        if (rooms.some(room => room.code === code)) {
            callback(true);
        } else {
            callback(false);
        }
    });

    //Add User To Room
    socket.on('join-room', (data, callback) => {
        socket.join(data.room);
        socket.username = data.username;
        rooms[rooms.findIndex(room => room.code == data.room)].users.push(socket.username);
        callback(true);
        console.table(rooms);
        io.in(data.room).emit('update-users', rooms[rooms.findIndex(room => room.code == data.room)].users);
        io.in(data.room).emit('message', { bold: `${socket.username} has joined!`, std: '' });
    });

    //Remove User From Room
    socket.on('disconnecting', () => {
        var info = socket.rooms;
        info.delete(socket.id);
        var currentRoom = info[Symbol.iterator]().next().value;
        try {
            rooms[rooms.findIndex(room => room.code == currentRoom)].users = rooms[rooms.findIndex(room => room.code == currentRoom)].users.filter((user) => user !== socket.username);
            console.table(rooms)
            io.in(currentRoom).emit('update-users', rooms[rooms.findIndex(room => room.code == currentRoom)].users);
            io.in(currentRoom).emit('message', { bold: `${socket.username} has left!`, std: '' });
        } catch (err) { console.log(err) }
    });

    //Send Messages
    socket.on('message', (message, callback) => {
        var info = socket.rooms;
        info.delete(socket.id);
        var currentRoom = info[Symbol.iterator]().next().value;
        socket.in(currentRoom).emit('message', { bold: socket.username, std: message });
        callback(true)

    })
});