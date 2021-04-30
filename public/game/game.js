import Snake from './snake.js'
import InputHandler from './input.js';

export default class Game{
    constructor(gameWidth, gameHeight){
        this.width = gameWidth;
        this.height = gameHeight;        
    }

    start(){
        this.snake = new Snake(this);
        new InputHandler();
        
        //other objects here with (this).
    }

    draw(ctx){
        this.snake.draw(ctx);

    }

    update(deltatime){
        this.snake.update(deltatime);
    }

}

