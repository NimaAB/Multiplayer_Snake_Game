import { drawGame } from './index.js';

const gameOverElement = document.getElementById("gameOver");

const socket = io(`${location.protocol}//${document.domain}:${location.port}`);

socket.on('connect', () => {
    console.log("I'm connected as ", socket.id);
});

socket.on('new_game_state', (gameState) => {
    requestAnimationFrame(()=>{
        drawGame( JSON.parse(gameState));
    });
});

socket.on('game_over',(point)=>{ //Her kan vi for eksempel få total poenger fra server.
    const p_tag = document.createElement('p');
    const p_text = document.createTextNode(`points: ${point}`);
    p_tag.appendChild(p_text);
    p_tag.classList.add("order-2");
    gameOverElement.appendChild(p_tag);
    gameOverElement.style.display = "flex";
})

export function inputHandler(event){
    const key_name = event.key
    socket.emit('key_down_event', key_name, socket.id);
}
