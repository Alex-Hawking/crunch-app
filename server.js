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
    })
});