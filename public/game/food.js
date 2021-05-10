export default class Food{
    constructor(game) {
        this.posision = {
            x: Math.floor(Math.random()*game.width),
            y: Math.floor(Math.random()*game.height)
        };
        this.UNIT = game.UNIT;
        this.food_image = document.getElementById("food")
    }
    draw(ctx) {
        ctx.drawImage(this.food_image,this.posision.x,this.posision.y,this.UNIT,this.UNIT);
    }
}
