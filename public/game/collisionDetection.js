export default class CollisionDetection{
    constructor(game, snake) {
        this.game = game;
        this.snake = snake;
    }

    wallCollisions(){
        //Not working properly yet
        //let front_of_head = this.snake.

        //left & right walls:
        if(this.snake.position.x === 0 || this.snake.position.x === this.game.width-this.snake.width){
            this.snake.speed.x = 0;
        }
        // up & down walls:
        if(this.snake.position.y === 0 || this.snake.position.y === this.game.height-this.snake.height){
            this.snake.speed.y = 0;
        }
    }
}