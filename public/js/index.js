import { inputHandler } from './client.js';

const GAME_BG_COLOR = "#283244FF";
const SNAKE_COLOR = "#A8F6EEFF";
const FOOD_COLOR = "#C63B59FF"

const gameDisplay = document.getElementById('gameDisplay');

let canvas;
let context;
function game_initializer(){
    canvas = document.getElementById('gameDisplay');
    context = gameDisplay.getContext('2d');
    canvas.width = canvas.height = 600;
    context.fillStyle = GAME_BG_COLOR;
    context.fillRect(0,0,canvas.width,canvas.height);

    document.addEventListener("keydown", inputHandler);
}

export function drawGame(gameState){
    const grid_size = gameState.grid_size;
    const game_size = canvas.width / grid_size;

    context.fillStyle = GAME_BG_COLOR;
    context.fillRect(0,0,canvas.width,canvas.height);

    drawFood(gameState.food, grid_size, game_size, FOOD_COLOR);
    drawPlayer(gameState.player, game_size, SNAKE_COLOR);

}

function drawFood(food, grid_size, game_size, color){
    context.fillStyle = color;
    context.fillRect(food.x * game_size, food.y * game_size, game_size,game_size);
}

function drawPlayer(game_player, game_size, color){
    context.fillStyle = color;
    game_player.snake_body
        .forEach(part => context.fillRect(part.x * game_size, part.y * game_size, game_size,game_size));
}


game_initializer();

