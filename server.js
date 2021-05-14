const express = require('express');  // imports express module
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

const { createGameState, gameLoop, updateVelocity } = require('./game/game.js');
const { FRAME_RATE } = require('./game/consts.js');

const app = express();
const port = process.env.PORT | 5000;
const host = 'localhost';
const server = http.createServer(app);
const io = new Server(server);


app.use(express.static(path.join(__dirname, 'public')));


io.on('connection', client => {
    const gameState = createGameState();

    client.on('key_down_event', (key_name)=>{
        const updated_velocity = updateVelocity(key_name,gameState.player.velocity);
        if(updated_velocity){
            gameState.player.velocity = updated_velocity;
        }
    });

    startGameInterval(client, gameState);
});

function startGameInterval(client, state){
    const intervalID = setInterval(() => {
        const winner_value = gameLoop(state);

        if(!winner_value){
            client.emit('new_game_state', JSON.stringify(state));
        }else{
            client.emit('game_over', state.player.point);
            clearInterval(intervalID);
        }
    }, 1000/FRAME_RATE);
}

server.listen(port, host, () => {
    console.log('Server running on port ', port ,'...');
});