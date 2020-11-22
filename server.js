var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

var rooms = ['1234', '4321']

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/static/index.html');
});

http.listen(3000, () => {
    console.log('Server Started On :*3000');
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('room-check', (code) => {
        if (rooms.includes(code)) {
            socket.emit('room-check', true);
            console.log('true');
        } else {
            socket.emit('room-check', false);
            console.log('false')
        }
    });
});