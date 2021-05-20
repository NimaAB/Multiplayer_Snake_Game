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

const gameOverElement = document.getElementById("gameOver");
const tooManyPlayers = document.getElementById("tooManyPlayers");
const gameOverTitle = document.getElementById("alert-title");

socket.on('connect', () => {
    console.log("I'm connected as ", socket.id);
});

socket.on('notValidName', (msg) => {
    alert(msg);
    location.reload();
});

socket.on('new_game_state', (gameState, serverPlayers) => {
    requestAnimationFrame(()=>{

        // gameState.players contains only active players
        gameState = JSON.parse(gameState);
        // serverPlayers contains both active and not active players
        serverPlayers = JSON.parse(serverPlayers);

        drawGame(gameState);
        updateLeaderBoard(gameState.players, serverPlayers);
    });
});

socket.on('game_over',(player) => {
    const p_tag = document.createElement('p');
    const p_text = document.createTextNode(`points: ${player.points}`);
    p_tag.appendChild(p_text);
    p_tag.classList.add("order-2");
    gameOverElement.appendChild(p_tag);
    gameOverElement.style.display = "flex";
    gameOverTitle.innerText = "You Lost!";
    gameOverTitle.style.color = 'red';

    // Play Again btn functionality
    playAgain.addEventListener("click", (e) => {
        gameOverElement.removeChild(p_tag);
        gameOverElement.style.display = "none";
        socket.emit('join_game_event', player.playerName, ROOMID);
    });
});

socket.on('winner', (player) => {
    const p_tag = document.createElement('p');
    const p_text = document.createTextNode(`points: ${player.points}`);
    p_tag.appendChild(p_text);
    p_tag.classList.add("order-2");
    gameOverElement.appendChild(p_tag);
    gameOverElement.style.display = "flex";
    gameOverTitle.innerText = "You Won!";
    gameOverTitle.style.color = 'seagreen';

    // Play Again btn functionality
    playAgain.addEventListener("click", (e) => {
        gameOverElement.removeChild(p_tag);
        gameOverElement.style.display = "none";
        socket.emit('join_game_event', player.playerName, ROOMID);
    });
});

socket.on('too_many_players', () => {
    tooManyPlayers.style.display = 'flex';
});

function inputHandler(event){
    const key_name = event.key
    socket.emit('key_down_event', key_name, socket.id);
}

// The display code:
const BG_IMG = document.getElementById("bg_image");

const canvas = document.getElementById('gameDisplay');
const context = canvas.getContext('2d');
function game_initializer(){
    start_page.style.display = "none";
    game_page.style.display = "block";
    canvas.width = canvas.height = 600;

    context.drawImage(BG_IMG,0,0,canvas.width,canvas.height);
    document.addEventListener("keydown", inputHandler);
}

function drawGame(gameState){
    const grid_size = gameState.grid_size;
    const game_size = canvas.width / grid_size;

    context.drawImage(BG_IMG,0,0,canvas.width,canvas.height);

    drawFood(gameState.foods, game_size);
    for(let player of gameState.players) {
        drawPlayer(player, game_size);
    }
}

function drawFood(foods, game_size){
    foods.forEach((food) => {
        context.fillStyle = food.type.color;
        context.fillRect(food.position.x * game_size, food.position.y * game_size, game_size, game_size);
    });
}

function drawPlayer(game_player, game_size){
    context.fillStyle = game_player.color;
    game_player.snake_body
        .forEach(part => context.fillRect(part.x * game_size, part.y * game_size, game_size,game_size));
}

/*###################################### Leaderboard #################################################################*/

const leaderBoard = document.getElementById('leaderBoard');
// Contains player names
let activePlayers = [];
// Contains player score elements
let playerScores = [];


function updateScore(gameStatePlayers, player){
    for(let divElement of playerScores){

        // gameState.players contains only active players, therefore can be used to check which players are not active
        let active = gameStatePlayers.find(p => p.playerName === player.playerName);

        // DOM elements of player's score panels
        let name = divElement.parentElement.getElementsByClassName('player-name')[0];
        let score = divElement.parentElement.getElementsByClassName('player-score')[0];

        // If player is active
        if(divElement.id === player.id) {
            divElement.parentElement.style.backgroundColor = player.color;
            score.innerText = player.points;
            name.innerText = player.playerName;
        }

        // If player is NOT active, score board will show offline
        if(active === undefined && divElement.id === player.id) {
            divElement.parentElement.style.backgroundColor = 'white';
            score.innerText = player.points; // Maybe change to best_score
            name.innerText = player.playerName + ' (offline)';
        }
    }
}

function updateLeaderBoard(gameStatePlayers, serverPlayers){
    for(let player of serverPlayers) {

        // If player not yet in the leaderboard, create score dom element and add it to leaderboard dom element
        if(!activePlayers.includes(player.playerName)) {
            const divElement = createPlayerScoreElement(player);
            playerScores.push({id: player.id, parentElement: divElement});
            activePlayers.push(player.playerName);
            leaderBoard.appendChild(divElement);

        // If player name already in the leaderboard, update their score
        } else {
            updateScore(gameStatePlayers, player);
        }
    }
}

// Creates a div element containing the players name and score
function createPlayerScoreElement(player){
    const divElement = document.createElement('div');
    const playerNameSpan = document.createElement('span');
    const playerScoreSpan = document.createElement('span');
    const divElementClasses = ["mb-3", "p-2", "d-flex", "justify-content-between"];
    playerNameSpan.classList.add("player-name");
    playerScoreSpan.classList.add("player-score");
    playerNameSpan.innerText = player.playerName;
    playerScoreSpan.innerText = player.points;
    divElement.classList.add(...divElementClasses);
    divElement.appendChild(playerNameSpan);
    divElement.appendChild(playerScoreSpan);
    return divElement;
}