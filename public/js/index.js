import { inputHandler } from './client.js';

const LINE_COLOR = "#c1c1c1"
const GAME_BG_COLOR = "#252525";
const BG_IMG = document.getElementById("bg_image");
const SNAKE_COLOR = "#A8F6EEFF";
const FOOD_COLOR = "#C63B59FF"

const gameDisplay = document.getElementById('gameDisplay');

let canvas;
let context;
function game_initializer(){
    canvas = document.getElementById('gameDisplay');
    context = gameDisplay.getContext('2d');
    canvas.width = canvas.height = 600;
    //context.fillStyle = GAME_BG_COLOR;
    //context.fillRect(0,0,canvas.width,canvas.height);

    context.drawImage(BG_IMG,0,0,canvas.width,canvas.height);
    document.addEventListener("keydown", inputHandler);
}

export function drawGame(gameState){
    const grid_size = gameState.grid_size;
    const game_size = canvas.width / grid_size;

    //context.fillStyle = GAME_BG_COLOR;
    //context.fillRect(0,0,canvas.width,canvas.height);
    context.drawImage(BG_IMG,0,0,canvas.width,canvas.height);


    drawFood(gameState.food, grid_size, game_size, FOOD_COLOR);
    drawPlayer(gameState.player, grid_size, game_size, SNAKE_COLOR);


}

function drawFood(food, grid_size, game_size, color){
    context.fillStyle = color;
    context.fillRect(food.x * game_size, food.y * game_size, game_size,game_size);
}

function drawPlayer(game_player, grid_size, game_size,color){
    context.fillStyle = color;
    game_player.snake_body
        .forEach(part => context.fillRect(part.x * game_size, part.y * game_size, game_size,game_size));
}

function drawGrid(game_size, color){
    context.fillStyle = color;
    for(let i = 0; i <= canvas.width; i++){
        context.moveTo(i*game_size, 0);
        context.lineTo(i*game_size, canvas.height);
        context.stroke();

        context.moveTo(0, i*game_size);
        context.lineTo(canvas.width,i*game_size);
        context.stroke();
    }
}

game_initializer();

