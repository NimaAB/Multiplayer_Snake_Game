export default class Snake{
    constructor(game){
        this.width = 15; 
        this.length = 45;

        this.position={
            x: Math.floor((Math.random()* game.width) + 1),
            y: Math.floor((Math.random()* game.height) + 1)
        };
        this.speed = 2;
    }

    draw(ctx) {
        ctx.fillStyle = "#e3e3e3";
        ctx.fillRect(this.position.x, this.position.y, this.width, this.length);
    }

    update(deltatime){
        if (!deltatime) return;
        this.position.y += this.speed;
    }

}