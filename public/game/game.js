import Snake from './snake.js'
import InputHandler from './input.js';
import CollisionDetection from "./collisionDetection.js";


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
        this.collision = new CollisionDetection(this,this.snake);

        //other objects here with (this).
    }

    draw(ctx){
        this.snake.draw(ctx);
        if(this.STATE === "DEAD"){
            this.gameOver(ctx);
        }
    }

    update(delta_time){
        this.snake.update(delta_time);
        this.collision.wallCollisions();
    }

    gameOver(ctx){
        ctx.font = "30px Arial";
        ctx.fillStyle = "red";
        ctx.textAlign = "center";
        ctx.fillText("Game Over", this.width/2, this.height/2);
    }

}

