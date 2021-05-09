export default class InputHandler {
    constructor(snake){
        document.addEventListener("keydown", (event) => {
            switch(event.key){
                case "ArrowUp": case "w":
                    snake.moveUp();
                    break;
                case "ArrowRight": case "d":
                    snake.moveRight();
                    break;
                case "ArrowDown": case "s":
                    snake.moveDown();
                    break;
                case "ArrowLeft": case "a":
                    snake.moveLeft();
                    break;
                case 81:
                    //quit(); back to menu or a new route for the leader board and a play again btn
                    break;
            }
        });
    }
}