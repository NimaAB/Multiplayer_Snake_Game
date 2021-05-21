const socket = io(`${location.protocol}//${document.domain}:${location.port}`);

const start_page = document.getElementById("startPage");
const game_page = document.getElementById("gameContainer");
const playAgain = document.getElementById("playAgain");
const joinGameBtn = document.getElementById("joinGame");
const playerNameInput = document.getElementById("playerName");
const nameAlert = document.getElementById("alert");

const ROOMID = "DATA";
joinGameBtn.addEventListener("click", ()=>{
    const playerName = playerNameInput.value;
    const reg = /^[a-zåøæA-ZÅØÆ0-9]{1,15}[_\.\* ]{0,2}$/;
    if(reg.test(playerName)){
        socket.emit('join_game_event', playerName, ROOMID);
        game_initializer();
    }else{
        nameAlert.style.display="block";
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

const recordsList = document.getElementById("records");
const clientRecords = [];
socket.on('records', (records)=>{
    records.forEach(record=>clientRecords.push(record));
});

function displayRecords(){
    clientRecords.forEach((record)=>{
        recordsList.innerHTML = `<li class="list">${record.name}: ${record.point}</li>`;
    });
}

socket.on('new_game_state', (gameState) => {
    requestAnimationFrame(()=>{
        gameState = JSON.parse(gameState);
        drawGame(gameState);
        updateLeaderBoard(gameState.players);
    });
});

const pdiv = document.getElementById("p");
socket.on('game_over',(player) => {
    const p_tag = `<p class="order-2">points: ${player.points}</p>`;
    pdiv.innerHTML = p_tag;
    gameOverElement.style.display = "flex";
    gameOverTitle.innerText = "You Lost!";
    gameOverTitle.style.color = 'red';

    // Play Again btn functionality
    playAgain.addEventListener("click", (e) => {
        pdiv.innerHTML = "";
        gameOverElement.style.display = "none";
        socket.emit('join_game_event', player.playerName, ROOMID);
    });
});


socket.on('winner', (player) => {
    const p_tag = `<p>points: ${player.points}</p>`;
    pdiv.innerHTML = p_tag;
    gameOverElement.style.display = "flex";
    gameOverTitle.innerText = "You Won!";
    gameOverTitle.style.color = 'seagreen';

    // Play Again btn functionality
    playAgain.addEventListener("click", (e) => {
        pdiv.innerHTML = "";
        gameOverElement.style.display = "none";
        socket.emit('join_game_event', player.playerName, ROOMID);
    });
});

socket.on('too_many_players', () => {
    tooManyPlayers.style.display = 'flex';
});

function inputHandler(event){
    const key_name = event.key;
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

socket.on('updateLeaderboard', (player) => {
    const toRemove = document.getElementById(player.id);
    toRemove.remove();
    let index_player = activePlayers.indexOf(player.playerName);
    activePlayers.splice(index_player,1);
    let index_element = playerScores.indexOf(toRemove.parentElement);
    playerScores.splice(index_element,1);
});

function updateScore(player){
    for(let objElement of playerScores){

        // DOM elements of player's score panels
        let name = objElement.parentElement.getElementsByClassName('player-name')[0];
        let score = objElement.parentElement.getElementsByClassName('player-score')[0];

        // If player is active
        if(objElement.id === player.id) {
            objElement.parentElement.style.backgroundColor = player.color;
            score.innerText = player.points;
            name.innerText = player.playerName;
        }
    }
}

function updateLeaderBoard(gameStatePlayers){
    for(let player of gameStatePlayers) {

        // If player not yet in the leaderboard, create score dom element and add it to leaderboard dom element
        if(!activePlayers.includes(player.playerName)) {
            const divElement = createPlayerScoreElement(player);
            playerScores.push({id: player.id, parentElement: divElement});
            activePlayers.push(player.playerName);
            leaderBoard.appendChild(divElement);

        // If player name already in the leaderboard, update their score
        } else {
            updateScore(player);
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
    divElement.setAttribute('id', player.id);
    divElement.appendChild(playerNameSpan);
    divElement.appendChild(playerScoreSpan);
    return divElement;
}