export default class InputHandler {
    constructor(snake){
        document.addEventListener("keydown", (event) => {
            switch(event.keyCode){
                case 38:
                    snake.moveUp();
                    break;
                case 39:
                    snake.moveRight();
                    break;
                case 40:
                    snake.moveDown();
                    break;
                case 37:
                    snake.moveLeft();
                    break;
                case 81:
                    //quit(); back to menu or a new route for the leader board and a play again btn
                    break;
            }
        });
    }
}