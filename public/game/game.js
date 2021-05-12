import Snake from './snake.js'
import InputHandler from './input.js';
import Food from "./food.js";
import {foodEaten} from "./collisionDetection.js";


export default class Game{
    constructor(gameWidth, gameHeight){
        this.UNIT = 20;
        this.width = gameWidth;
        this.height = gameHeight;
        this.foods = [];
    }

    start(){
        this.snake = new Snake(this);
        for(let i = 0; i < 4; i++){
            this.foods.push(new Food(this));
        }
        new InputHandler(this.snake);

        //other objects here with (this).
    }

    draw(ctx){
        this.snake.draw(ctx);
        this.foods.forEach(food => food.draw(ctx))
    }

    update(delta_time){
        if (!delta_time) return;
        this.snake.update(delta_time);
        this.eat();
    }

    eat(){
        //Working here
        this.foods.forEach(food => {
            if(foodEaten(this.snake,food)){
                food.eaten = true;
            }
        });
        this.foods.filter(food => food.eaten).forEach(eatenFood => this.foods.pop(eatenFood));

        if(this.foods.length<4){
            this.foods.push(new Food(this))
        }
    }

}

