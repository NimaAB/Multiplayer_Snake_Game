import Snake from './snake.js'
import InputHandler from './input.js';


export default class Game{
    constructor(gameWidth, gameHeight){
        this.UNIT = 20;
        this.hardness = 2;
        this.width = gameWidth;
        this.height = gameHeight;        
    }

    start(){
        this.snake = new Snake(this);
        new InputHandler(this.snake);

        
        //other objects here with (this).
    }

    draw(ctx){
        this.snake.draw(ctx);

    }

    update(deltatime){
        this.snake.update(deltatime);
    }

}

