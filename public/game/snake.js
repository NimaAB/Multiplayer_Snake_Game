import CollisionDetection from "./collisionDetection.js";


export default class Snake {
    constructor(game) {
        this.width = game.UNIT;
        this.height = game.UNIT;
        this.snake_body = [];
        this.snake_length = 20; // change the snake length to make the snake longer or shorter

        this.head_position = {
            x: Math.floor((Math.random() * game.width) + 1),
            y: Math.floor((Math.random() * game.height) + 1)
        };

        this.SPEED = game.hardness;
        this.speed = {
            x: 2,
            y: 0
        };

        this.collisions = new CollisionDetection(game, this);
    }

    draw(ctx) {
        for(let i = 0; i < this.snake_body.length; i++){
            let body_part = this.snake_body[i];
            ctx.fillStyle = "#401f71";
            ctx.fillRect(
                body_part[0],
                body_part[1],
                this.width,
                this.height
            );
        }
    }


    update(delta_time) {
        if (!delta_time) return;

        //if the block has a horizontal speed then it will only change the vertical speed/direction.
        if (this.speed.y === 0) {
            this.head_position.x += this.speed.x;
        }
        //if the block has a vertical speed then it will only change the horizontal speed/direction.
        if (this.speed.x === 0) {
            this.head_position.y += this.speed.y;
        }
        // When a body part is drawn in front, a body must be removed at the back
        if(this.snake_body.length > this.snake_length){
            this.snake_body.shift();
        }
        // Adds a new body part to the snake
        this.snake_body.push([this.head_position.x, this.head_position.y]);

        //this.collisions.wallCollisions();
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
}
