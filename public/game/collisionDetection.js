export default class CollisionDetection {
    constructor(game, snake) {
        this.game = game;
        this.snake = snake;
    }

    wallCollisions() {
        //Not working properly yet
        let head = this.snake.posisions[this.snake.posisions.length - 1];
        let head_x_pos = head[0];
        let head_y_pos = head[1];

        if (
            //left & right walls:
            head_x_pos === 0
            || head_x_pos === this.snake.SPEED
            || head_x_pos === -this.snake.SPEED
            || head_x_pos === this.game.width - this.snake.SPEED
            || head_x_pos === this.game.width + this.snake.SPEED
            // up & down walls:
            || head_y_pos === 0
            || head_y_pos === this.snake.SPEED
            || head_y_pos === -this.snake.SPEED
            || head_y_pos === this.game.height - this.snake.SPEED
            || head_y_pos === this.game.height + this.snake.SPEED
        ) {
            this.game.STATE = "DEAD";
        }

    }
}