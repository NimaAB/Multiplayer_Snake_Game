const express = require('express');  // imports express module
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

const { createGameState, gameLoop, updateVelocity, createPlayer } = require('./game/game.js');
const { FRAME_RATE } = require('./game/consts.js');

const app = express();
const port = process.env.PORT | 5000;
const host = 'localhost';
const server = http.createServer(app);
const io = new Server(server);


app.use(express.static(path.join(__dirname, 'public')));

const gameState = createGameState();
let loopStarted = false;


io.on('connection', client => {
    let x = Math.floor(Math.random() * 5);
    let y = Math.floor(Math.random() * 10) + 5;
    const player = createPlayer(x,y,client.id);

    client.on('key_down_event', (key_name, client_id)=>{
        for(let player of gameState.players) {
            if(client_id === player.id){
                const updated_velocity = updateVelocity(key_name, player.velocity);
                if(updated_velocity){
                    player.velocity = updated_velocity;
                }
            }
        }
    });

    if(gameState.players.length === 5) {
        client.emit('too_many_players');
        client.disconnect(true);
    } else {
        gameState.players.push(player);
        if(!loopStarted) {
            startGameInterval(client, gameState);
            loopStarted = true;
        }
    }
});

function startGameInterval(client, state){
    const intervalID = setInterval(() => {
        const loser = gameLoop(state);

        if(!loser){
            io.emit('new_game_state', JSON.stringify(state));
        } else {
            for(let player of state.players){
                io.emit('game_over', player);
                clearInterval(intervalID);
                state.players = [];
            }
            loopStarted = false;
        }
    }, 1000/FRAME_RATE);
}

server.listen(port, host, () => {
    console.log('Server running on port ', port ,'...');
});