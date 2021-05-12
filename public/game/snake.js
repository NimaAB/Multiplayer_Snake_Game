import {hasCollided} from "./collisionDetection.js";

export default class Snake {
    constructor(game) {
        this.game = game;
        this.width = game.UNIT;
        this.height = game.UNIT;
        this.snake_length = 3 * game.UNIT; // change the snake length to make the snake longer or shorter
        this.posisions = [];
        this.start_position = {
            x: Math.floor((Math.random() * game.width-100) + 100),
            y: Math.floor((Math.random() * game.height-100) + 100)
        };

        this.SPEED = 2;
        this.speed = {
            x: 2,
            y: 0
        };
        this.points = 0;
    }

    draw(ctx) {
        for (let i = 0; i < this.posisions.length; i++) {
            let body_part = this.posisions[i];
            if (i === this.posisions.length - 1) {
                ctx.fillStyle = "#401f71";
                ctx.fillRect(body_part[0], body_part[1], this.width, this.height);
            } else {
                ctx.fillStyle = "#7652b8";
                ctx.fillRect(body_part[0], body_part[1], this.width, this.height);
            }
        }
    }


    update(delta_time) {
        if (!delta_time) return;
        this.move();
        // Adds a new body part to the snake
        this.posisions.push([this.start_position.x, this.start_position.y]);

        if(hasCollided(this.game, this)){
            console.log("collision")
            this.onGameOver();
        }

    }

    move() {
        //if the block has a horizontal speed then it will only change the vertical speed/direction.
        if (this.speed.y === 0) {
            this.start_position.x += this.speed.x;
        }

        //if the block has a vertical speed then it will only change the horizontal speed/direction.
        if (this.speed.x === 0) {
            this.start_position.y += this.speed.y;
        }

        // When a body part is drawn in front, a body must be removed at the back
        if (this.posisions.length > this.snake_length) {
            this.posisions.shift();
        }
    }

    moveUp() {
        if (this.speed.x !== 0) {
            this.speed.x = 0;
            this.speed.y = -this.SPEED;
        }
    }

    moveDown() {
        if (this.speed.x !== 0) {
            this.speed.x = 0;
            this.speed.y = this.SPEED;
        }
    }

    moveLeft() {
        if (this.speed.y !== 0) {
            this.speed.x = -this.SPEED;
            this.speed.y = 0;
        }
    }

    moveRight() {
        if (this.speed.y !== 0) {
            this.speed.x = this.SPEED;
            this.speed.y = 0;
        }
    }

    onGameOver(){
        document.getElementById("gameOver").style.display = "block";
    }
}
