const express = require('express');  // imports express module
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const port = process.env.PORT | 5000;
const host = 'localhost';
const server = http.createServer(app);
const io = new Server(server);


app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', socket => {
    console.log('Connection to client', socket.id, 'has been established');
});

server.listen(port, host, () => {
    console.log('Server running on port ', port ,'...');
});