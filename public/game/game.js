import Snake from './snake.js'
import InputHandler from './input.js';


export default class Game{
    constructor(gameWidth, gameHeight){
        this.UNIT = 20;
        this.width = gameWidth;
        this.height = gameHeight;
        this.STATE = "ALIVE";
    }

    start(){
        this.snake = new Snake(this);
        new InputHandler(this.snake);

        //other objects here with (this).
    }

    draw(ctx){
        this.snake.draw(ctx);
        if(this.STATE === "DEAD"){
            this.gameOver(ctx);
        }
    }

    update(deltatime){
        this.snake.update(deltatime);
    }

    gameOver(ctx){
        ctx.font = "30px Arial";
        ctx.fillStyle = "red";
        ctx.textAlign = "center";
        ctx.fillText("Game Over", this.width/2, this.height/2);
    }

}

