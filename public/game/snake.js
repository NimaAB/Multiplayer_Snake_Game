export default class Snake {
    constructor(game) {
        this.width = 15;
        this.height = 15;

        this.position = {
            x: Math.floor((Math.random() * game.width) + 1),
            y: Math.floor((Math.random() * game.height) + 1)
        };

        this.SPEED = 2;
        this.speed = {
            x: 2,
            y: 0
        };
    }

    draw(ctx) {
        ctx.fillStyle = "#e3e3e3";
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    update(delta_time) {
        if (!delta_time) return;

        //if the block has a horizontal speed then it will only change the vertical speed/direction.
        if (this.speed.y === 0) {
            this.position.x += this.speed.x;
        }
        //if the block has a vertical speed then it will only change the horizontal speed/direction.
        if (this.speed.x === 0) {
            this.position.y += this.speed.y;
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
}