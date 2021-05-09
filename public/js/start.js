import Game from '../game/game.js'

const canvas = document.getElementById('gameDisplay');
const ctx = canvas.getContext('2d');
ctx.clearRect(0,0,500,500)

const DISP_HEIGHT = 498;
const DISP_WIDTH = 498;

const game = new Game(DISP_WIDTH, DISP_HEIGHT);
game.start();

let lastTime = 0;
function gameLoop(timestamp){
    let delta_time = timestamp - lastTime;
    lastTime = timestamp;

    ctx.clearRect(0,0,DISP_WIDTH,DISP_HEIGHT);
    game.draw(ctx);
    game.update(delta_time);

    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);


