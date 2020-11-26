var express = require('express');
var app = express();

var http = require('http').createServer(app);
var io = require('socket.io')(http);

var rooms = [
    { code: '1111', users: [] }
];

var rn = () => {
    var number = String(Math.floor(Math.random() * 10))
    return number;
};

app.use(express.static(__dirname + '/static'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/static/index.html');
});

http.listen(process.env.PORT || 3000, () => {
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
        try {
            socket.join(data.room);
            socket.username = data.username;
            socket.currentRoom = data.room;
            rooms[rooms.findIndex(room => room.code == socket.currentRoom)].users.push(socket.username);
            callback(true);
            console.table(rooms);
            io.in(data.room).emit('update-users', rooms[rooms.findIndex(room => room.code == data.room)].users);
            io.in(data.room).emit('message', { bold: `${socket.username} has joined!`, std: '' });
        } catch (error) {
            callback(false);
        }
    });

    //Create Room 

    socket.on('create-room', (callback) => {
        var code = `${rn()}${rn()}${rn()}${rn()}`;
        if (rooms.some(room => room.code !== code)) {
            rooms.push({ code: code, users: [] });
            callback(code)
        }

    })

    //Remove User From Room
    socket.on('disconnecting', () => {
        try {
            rooms[rooms.findIndex(room => room.code == socket.currentRoom)].users = rooms[rooms.findIndex(room => room.code == socket.currentRoom)].users.filter((user) => user !== socket.username);
            io.in(socket.currentRoom).emit('update-users', rooms[rooms.findIndex(room => room.code == socket.currentRoom)].users);
            io.in(socket.currentRoom).emit('message', { bold: `${socket.username} has left!`, std: '' });

            if (rooms[rooms.findIndex(room => room.code == socket.currentRoom)].users.length == 0 && socket.currentRoom !== '1111') {
                rooms.splice([rooms.findIndex(room => room.code == socket.currentRoom)], 1);
            }

            console.table(rooms)
        } catch (err) { console.log(err) }
    });

    //Send Messages
    socket.on('message', (message, callback) => {
        socket.in(socket.currentRoom).emit('message', { bold: socket.username, std: message });
        callback(true)

    })
});