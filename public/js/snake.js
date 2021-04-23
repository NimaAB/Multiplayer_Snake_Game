
export default class Snake{
    constructor(disp_width,disp_height){
        this.width = 15; 
        this.length = 45;

        this.position={
            x: Math.floor((Math.random()*disp_width) + 1),
            y: Math.floor((Math.random()*disp_height) + 1)
        };
    }

    draw(ctx) {
        ctx.fillStyle = "#e3e3e3";
        ctx.fillRect(this.position.x, this.position.y, this.width, this.length);
    }

    update(){

    }

}