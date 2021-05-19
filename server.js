const express = require('express');  // imports express module
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

const { createGameState, gameLoop, updateVelocity, createPlayer } = require('./game/game.js');
const { FRAME_RATE } = require('./game/consts.js');
const { isPlayerNameValid, playerAlreadyActive } = require('./game/validation.js');

const app = express();
const PORT = 5000;
const HOST = '0.0.0.0';
const server = http.createServer(app);
const io = new Server(server);


app.use(express.static(path.join(__dirname, 'public')));
const ROOM_ID = "DATA";
// const room_clients = {};
const gameState_for_room = { "DATA": createGameState() };
// ensures that the gameLoop runs once per game
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
                
                // Checks if client already has an active snake
                if(!playerAlreadyActive(client.id, gameState_for_room[roomid])) {
                    const newPlayer = createPlayer(playerName, client.id);
                    gameState_for_room[roomid].players.push(newPlayer);
                    client.join(roomid);
                }
                // Checks if the game loop has been started
                if(!loopStarted) {
                    startGameInterval(gameState_for_room[roomid]);
                    loopStarted = true;
                }
            } else {
                const msg = "Not valid valid name. Name can be 1-15 characters long and " +
                            "can contain spaces, underlines, and dots.";
                client.emit('notValidName', msg);
                client.disconnect(true);
            }
        }
    }

    function keydownHandler(key_name, client_id){
        gameState_for_room[ROOM_ID].players.forEach(player => {
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

            // Sends a game over alert
            const id = loser.id;
            io.to(id).emit('game_over', loser);

            // Removes the player from the current game state
            let index = state.players.indexOf(loser);
            state.players.splice(index, 1);
            
            if(state.players.length === 1 && state.players[0] === loser.id){
                const winner = state.players[0];
                io.emit('winner', winner);
                let index = state.players.indexOf(winner);
                state.players.splice(index, 1);
                clearInterval(intervalID);
                loopStarted = false;
            }    
        }
    }, 1000/FRAME_RATE);
}

server.listen(PORT, HOST, () => {
    console.log('Server running on port ', PORT ,'...');
});