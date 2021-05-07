import CollisionDetection from "./collisionDetection.js";


export default class Snake {
    constructor(game) {
        this.width = game.UNIT;
        this.height = game.UNIT;

        this.bodyParts = 4;

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
        ctx.fillStyle = "#401f71";
        ctx.fillRect(
            this.head_position.x,
            this.head_position.y,
            this.width,
            this.height
        );
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
        this.collisions.wallCollisions();
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
