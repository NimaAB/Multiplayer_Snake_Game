const socket = io(`${location.protocol}//${document.domain}:${location.port}`);

const start_page = document.getElementById("startPage");
const game_page = document.getElementById("gameContainer");
const playAgain = document.getElementById("playAgain");
const joinGameBtn = document.getElementById("joinGame");
const playerNameInput = document.getElementById("playerName");

const ROOMID = "DATA"; //Don't Change ME, please!
joinGameBtn.addEventListener("click", ()=>{
    const playerName = playerNameInput.value;
    const reg = /^[a-zåøæA-ZÅØÆ0-9]{1,15}[_\.\* ]{0,2}$/;
    if(reg.test(playerName)){
        socket.emit('join_game_event', playerName, ROOMID);
        game_initializer();
    }
});

playAgain.addEventListener("click", (e) => {
    //TODO: emplenet rejoin.
});

const gameOverElement = document.getElementById("gameOver");
const tooManyPlayers = document.getElementById("tooManyPlayers");

socket.on('connect', () => {
    console.log("I'm connected as ", socket.id);
});

socket.on('notValidName', (msg) => {
    alert(msg)
});
socket.on('new_game_state', (gameState) => {
    requestAnimationFrame(()=>{
        drawGame(JSON.parse(gameState));
    });
});

socket.on('game_over',(player) => {
    const p_tag = document.createElement('p');
    const p_text = document.createTextNode(`points: ${player.points}`);
    p_tag.appendChild(p_text);
    p_tag.classList.add("order-2");
    gameOverElement.appendChild(p_tag);
    gameOverElement.style.display = "flex";
});

socket.on('winner', (player) => {
    const p_tag = document.createElement('p');
    const p_text = document.createTextNode(`points: ${player.points}`);
    p_tag.appendChild(p_text);
    p_tag.classList.add("order-2");
    gameOverElement.appendChild(p_tag);
    gameOverElement.style.display = "flex";
})

socket.on('too_many_players', () => {
    tooManyPlayers.style.display = 'flex';
});

function inputHandler(event){
    const key_name = event.key
    socket.emit('key_down_event', key_name, socket.id);
}

// The display code:
const BG_IMG = document.getElementById("bg_image");
const SNAKE_COLOR = "#A8F6EEFF";
const FOOD_COLOR = "#C63B59FF";


const canvas = document.getElementById('gameDisplay');
const context = canvas.getContext('2d');
function game_initializer(){
    start_page.style.display = "none";
    game_page.style.display = "block";
    //canvas = document.getElementById('gameDisplay');
    //context = gameDisplay.getContext('2d');
    canvas.width = canvas.height = 600;

    context.drawImage(BG_IMG,0,0,canvas.width,canvas.height);
    document.addEventListener("keydown", inputHandler);
}

function drawGame(gameState){
    const grid_size = gameState.grid_size;
    const game_size = canvas.width / grid_size;

    context.drawImage(BG_IMG,0,0,canvas.width,canvas.height);

    drawFood(gameState.food, game_size, FOOD_COLOR);
    for(let player of gameState.players) {
        drawPlayer(player, game_size, SNAKE_COLOR);
    }
}

function drawFood(food, game_size, color){
    context.fillStyle = color;
    context.fillRect(food.x * game_size, food.y * game_size, game_size, game_size);
}

function drawPlayer(game_player, game_size, color){
    context.fillStyle = color;
    game_player.snake_body
        .forEach(part => context.fillRect(part.x * game_size, part.y * game_size, game_size,game_size));
}