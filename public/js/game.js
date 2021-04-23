import Snake from './snake.js'
const canvas = document.getElementById('gameDisplay');
const ctx = canvas.getContext('2d');
ctx.clearRect(0,0,500,500)

const DISP_HEIGHT = 500;
const DISP_WIDTH = 500

let snake = new Snake(DISP_WIDTH, DISP_HEIGHT);
snake.draw(ctx)

