const express = require('express');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

const { createGameState, gameLoop, updateVelocity, createPlayer } = require('./game/game.js');
const { FRAME_RATE } = require('./game/consts.js');
const { playerAlreadyActive } = require('./game/validation.js');

const app = express();
const port = process.env.PORT || 5000;
const server = http.createServer(app);
const io = new Server(server);


app.use(express.static(path.join(__dirname, 'public')));
const ROOM_ID = "DATA";
const gameState_for_room = { "DATA": createGameState() };
const records = []; //will save  <recordobj = {playerName:"name", point: 50}>
// ensures that the gameLoop runs once per game
let loopStarted = false;
// number of players that joined the current game loop
let numberOfPlayers = 0;

io.on('connection', client => {
    
    client.on('key_down_event', keydownHandler);
    client.on('join_game_event', joinGameHandler);
    io.emit('records', records);

    function joinGameHandler(playerName, roomid){
        if(gameState_for_room[roomid].players.length === 5) {
            client.emit('too_many_players');
            client.disconnect(true);
        } else {
            // Checks if client already has an active snake
            if(!playerAlreadyActive(client.id, gameState_for_room[roomid])) {
                const newPlayer = createPlayer(playerName, client.id);
                gameState_for_room[roomid].players.push(newPlayer);
                client.join(roomid);
                numberOfPlayers++;
            }
            // Checks if the game loop has been started
            if(!loopStarted) {
                startGameInterval(gameState_for_room[roomid]);
                loopStarted = true;
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

            updateRecords(loser);

            if(state.players.length === 1 && state.players[0].id === loser.id){
                const player = state.players[0];

                // If single player, winner is not announced
                if(numberOfPlayers === 1) {
                    io.to(player.id).emit('single_player', player);
                // If multiple player, a winner will be announced
                } else {
                    io.to(player.id).emit('winner', player);
                }

                // Removes player from the current game state
                let index = state.players.indexOf(player);
                state.players.splice(index, 1);

                // Stops game loop
                clearInterval(intervalID);
                loopStarted = false;
                numberOfPlayers = 0;

            } else {

                // Sends a game over alert
                io.to(loser.id).emit('game_over', loser);

                // Removes the player from the current game state
                let index = state.players.indexOf(loser);
                state.players.splice(index, 1);
            }

            // Updates leaderboard
            io.emit('updateLeaderboard', loser);
        }
    }, 1000/FRAME_RATE);
}

function updateRecords(loser){
    if(loser.points > loser.best_score){
        loser.best_score = loser.points;
        const record = {
            name: loser.playerName,
            point: loser.best_score
        };

        // If record already exist, update the record, else push the record
        const r = records.find(r => r.name === loser.playerName);
        if(r) {
            const index = records.indexOf(r);
            records[index].point = loser.best_score;
        } else {
            records.push(record);
        }
    }
}

server.listen(port, () => {
    console.log('Server running on port ', port ,'...');
});