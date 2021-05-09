export default class CollisionDetection{
    constructor(game, snake) {
        this.game = game;
        this.snake = snake;
    }

    wallCollisions(){
        //Not working properly yet
        let head = this.snake.snake_body[this.snake.snake_body.length-1];
        let head_x_pos = head[0];
        let head_y_pos = head[1];

        //left & right walls:
        if(head_x_pos + this.snake.width/2 === 0 || head_x_pos + this.snake.width/2 === this.game.width){
            this.snake.speed.x = 0;
        }
        // up & down walls:
        if(head_y_pos === 0 || head_y_pos === this.game.height){
            this.snake.speed.y = 0;
        }
    }
}