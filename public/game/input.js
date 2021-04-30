export default class InputHandler {
    constructor(){
        document.addEventListener("keydown", (event) => {
            alert(event.keyCode)
            switch(event.keyCode){
                case 38:
                    //moveUp();
                    break;
                case 39:
                    //turnRight(); another choice!
                    //moveRight();
                    break;
                case 40:
                    //moveDown();
                    break;
                case 37:
                    //turnLeft(); another choice!
                    //moveLeft();
                    break;
                case 81:
                    //quit(); back to menu or a new route for the leader board and a paly again btn
                    break;
            }
        });
    }
}