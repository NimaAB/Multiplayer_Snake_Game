const express = require('express');  // imports express module
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

const { createGameState, gameLoop, updateVelocity, createPlayer } = require('./game/game.js');
const { FRAME_RATE } = require('./game/consts.js');
const { isPlayerNameValid } = require('./game/validation.js');

const app = express();
const PORT = 5000;
const HOST = '0.0.0.0';
const server = http.createServer(app);
const io = new Server(server);


app.use(express.static(path.join(__dirname, 'public')));
const ROOMID = "DATA";
//const room_clients = {};
const gameState_for_room = { "DATA": createGameState() };
//
let loopStarted = false;


io.on('connection', client => {
    
    client.on('key_down_event', keydownHandler);
    client.on('join_game_event', joinGameHandler);
    
    function joinGameHandler(playerName, roomid){
        if(gameState_for_room[roomid].players.length === 5) {
            client.emit('too_many_players');
            client.disconnect(true);
        } else {
            if (isPlayerNameValid(playerName)){
                let x = Math.floor(Math.random() * 25) + 2;
                let y = Math.floor(Math.random() * 30);
                const newPlayer = createPlayer(x,y, playerName, client.id); 
                gameState_for_room[roomid].players.push(newPlayer);
                client.join(roomid);
                if(!loopStarted) {
                    startGameInterval(gameState_for_room[roomid]);
                    loopStarted = true;
                }
            }else{
                const msg = "Not valid valid name, name can be 1-15 character long and can contian two spaces, underline, start or dot in the midle or end.";
                client.emit('notValidName', msg);
                client.disconnect(true);
            }
        }
        
    }

    function keydownHandler(key_name, client_id){
        gameState_for_room[ROOMID].players.forEach(player => {
            if(client_id === player.id){
                const updated_velocity = updateVelocity(key_name, player.velocity);
                if(updated_velocity){
                    player.velocity = updated_velocity;
                }
            }
        });
    }
});

function startGameInterval(state){
    const intervalID = setInterval(() => {
        const loser = gameLoop(state);
        if(!loser){
            io.emit('new_game_state', JSON.stringify(state));
        } else {
            const id = loser.id;
            io.to(id).emit('game_over', loser);
            state.players.pop(loser);

            if(state.players === 1){
                const winner = state.players[0];
                io.emit('winner-event', state.players.pop(winner));
                clearInterval(intervalID);
                loopStarted = false;
            }    
        }
    }, 1000/FRAME_RATE);
}

server.listen(PORT, HOST, () => {
    console.log('Server running on port ', PORT ,'...');
});