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

socket.on('notValidName', (msg) => {
    alert(msg);
    location.reload();
});

const recordsList = document.getElementById("records");
//const clientRecords = [];
socket.on('records', (records)=>{
    if(records.length> 0){
        console.log(records);
        displayRecords(records);
    }
});

function displayRecords(records){
    records.forEach((record)=>{
        console.log(record)
        let listNode = document.createElement('li');
        listNode.classList.add('list');
        listNode.innerHTML = `${record.name}: ${record.point}`;
        recordsList.appendChild(listNode);
    });
}

socket.on('new_game_state', (gameState) => {
    requestAnimationFrame(()=>{
        gameState = JSON.parse(gameState);
        drawGame(gameState);
        updateLeaderBoard(gameState.players);
    });
});

function inputHandler(event){
    const key_name = event.key;
    socket.emit('key_down_event', key_name, socket.id);
}

/*########################################## Game UI #################################################################*/

const BG_IMG = document.getElementById("bg_image");
const APPLE_IMG = document.getElementById("apple_image");
const KIWI_IMG = document.getElementById("kiwi_image");
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
        if(food.type.name === 'apple') {
            context.drawImage(APPLE_IMG, food.position.x * game_size, food.position.y * game_size, game_size, game_size);
        } else {
            context.drawImage(KIWI_IMG, food.position.x * game_size, food.position.y * game_size, game_size, game_size);
        }
    });
}

function drawPlayer(game_player, game_size){
    context.fillStyle = game_player.color;
    game_player.snake_body
        .forEach(part => context.fillRect(part.x * game_size, part.y * game_size, game_size,game_size));
}

/*############################################ Alert Dialogs #########################################################*/

const gameOverElement = document.getElementById("gameOver");
const tooManyPlayers = document.getElementById("tooManyPlayers");
const gameOverTitle = document.getElementById("alert-title");
const p_div = document.getElementById("p");

socket.on('game_over',(player) => {
    displayAlert(player, 'You Lost!', '#bb4430');
});

socket.on('winner', (player) => {
    displayAlert(player, 'You Won!', '#73a942');
});

socket.on('single_player',(player) => {
    displayAlert(player, 'Your Score!', '#00b2ca');
});

socket.on('too_many_players', () => {
    tooManyPlayers.style.display = 'flex';
});

function displayAlert(player, alertTitle, alertColor){
    p_div.innerHTML = `<p class="order-2">points: ${player.points}</p>`;
    gameOverElement.style.display = "flex";
    gameOverTitle.innerText = alertTitle;
    gameOverTitle.style.color = alertColor;

    // Play Again btn functionality
    playAgain.addEventListener("click", (e) => {
        p_div.innerHTML = "";
        gameOverElement.style.display = "none";
        socket.emit('join_game_event', player.playerName, ROOMID);
    });
}

/*###################################### Leaderboard #################################################################*/

const leaderBoard = document.getElementById('leaderBoard');
// Contains player names
let activePlayers = [];
// Contains player score div elements
let leaderboardScores = [];

// Removes player from leaderboard whenever they lose
socket.on('updateLeaderboard', (loser) => {

    // Removes score element from the dom
    const toRemove = document.getElementById(loser.id);
    toRemove.remove();

    // Removes player name from the active players array
    let index_player = activePlayers.indexOf(loser.playerName);
    activePlayers.splice(index_player,1);

    // Removes score element from leaderboard scores array
    let index_element = leaderboardScores.indexOf(toRemove.parentElement);
    leaderboardScores.splice(index_element,1);

});

function updateScore(player){
    for(let objElement of leaderboardScores){
        let score = objElement.parentElement.getElementsByClassName('player-score')[0];
        if(objElement.id === player.id) {
            score.innerText = player.points;
        }
    }
}

function updateLeaderBoard(gameStatePlayers){
    for(let player of gameStatePlayers) {

        // If player not yet in the leaderboard, create score dom element and add it to leaderboard dom element
        if(!activePlayers.includes(player.playerName)) {
            const divElement = createPlayerScoreElement(player);
            leaderboardScores.push({id: player.id, parentElement: divElement});
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
    const divElementClasses = ["text-white", "mb-3", "p-2", "d-flex", "justify-content-between"];
    playerNameSpan.classList.add("player-name");
    playerScoreSpan.classList.add("player-score");

    if(player.id === socket.id) {
        playerNameSpan.innerText = '(You) ' + player.playerName;
    } else {
        playerNameSpan.innerText = player.playerName;
    }

    playerScoreSpan.innerText = player.points;
    divElement.style.backgroundColor = player.color;
    divElement.classList.add(...divElementClasses);
    divElement.setAttribute('id', player.id);
    divElement.appendChild(playerNameSpan);
    divElement.appendChild(playerScoreSpan);
    return divElement;
}