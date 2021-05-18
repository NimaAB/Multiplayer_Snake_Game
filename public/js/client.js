import { game_initializer, drawGame } from './index.js';

const gameOverElement = document.getElementById("gameOver");
const waitingForPlayers = document.getElementById("waitingForPlayers");
const tooManyPlayers = document.getElementById("tooManyPlayers");

const socket = io(`${location.protocol}//${document.domain}:${location.port}`);

socket.on('init', () => {
    game_initializer();
})

socket.on('new_game_state', (gameState) => {
    waitingForPlayers.style.display = 'none';
    requestAnimationFrame(()=>{
        drawGame( JSON.parse(gameState));
    });
});

socket.on('game_over',(player)=>{ //Her kan vi for eksempel få total poenger fra server.
    const p_tag = document.createElement('p');
    const p_text = document.createTextNode(`points: ${player.points}`);
    p_tag.appendChild(p_text);
    p_tag.classList.add("order-2");
    gameOverElement.appendChild(p_tag);
    gameOverElement.style.display = "flex";
});

socket.on('waiting_for_players', () => {
    waitingForPlayers.style.display = 'flex';
});

socket.on('too_many_players', () => {
    tooManyPlayers.style.display = 'flex';
});

export function inputHandler(event){
    const key_name = event.key
    socket.emit('key_down_event', key_name, socket.id);
}
