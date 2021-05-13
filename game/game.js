const { GRID_SIZE } = require('./consts.js');
const { collidedToWall, collidedToSnake, collidedToFood } = require('./collisions.js');

module.exports = { createGameState, gameLoop, updateVelocity }

function gameLoop(state){
    if(!state) return;
    const player_one = state.player;
    player_one.position.x += player_one.velocity.x;
    player_one.position.y += player_one.velocity.y;

    if(collidedToWall(player_one.position, GRID_SIZE)){
        return 2;
    }
    if(collidedToFood(player_one.position, state.food)){
        player_one.snake_body.push({...player_one.position}); //legger hode koordinatene på hallen
        player_one.position.x += player_one.velocity.x;
        player_one.position.y += player_one.velocity.y;
        newFood(state);
    }

    if(player_one.velocity.x || player_one.velocity.y){
        if(collidedToSnake()){
            return 2;
        }
        player_one.snake_body.push({...player_one.position}) //legger hode koordinatene på hallen
        player_one.snake_body.shift();
    }
    return false;
}

function createGameState(){
    return  {
    player:{
        //head position
        position: {
            x:4,
            y:5,
        },
        velocity: {
            x: 1,
            y: 0
        },
        snake_body: [
            {x: 1, y: 5},
            {x: 2, y: 5},
            {x: 3, y: 5},
            {x: 4, y: 5}, //head
        ],
    },
    food: {
        x: 9,
        y: 9
    },
    grid_size: GRID_SIZE //each cell will by 20px by 20px
    };
}

function newFood(state){
    let food = {
        x: Math.floor(Math.random()*GRID_SIZE),
        y: Math.floor(Math.random()*GRID_SIZE)
    };

    //sjekker om maten er ikke på en rute som en slage ligger på.
    state.player.snake_body.forEach((snake_part) =>{
        if(food.x === snake_part.x && food.y === snake_part.y){
            return newFood(state);
        }
    });

    state.food = food;
}

function updateVelocity(key_name,velocity){
    switch(key_name){
                case "ArrowUp": case "w":
                    if(velocity.y === 0){
                        return {x: 0, y: -1};
                    }
                    break;
                case "ArrowRight": case "d":
                    if(velocity.x === 0){
                        return {x: 1, y: 0};
                    }
                    break;
                case "ArrowDown": case "s":
                    if(velocity.y === 0){
                        return {x: 0, y: 1};
                    }
                    break;
                case "ArrowLeft": case "a":
                    if(velocity.x === 0){
                        return {x: -1, y: 0};
                    }
                    break;
                default:
                    return false;
            }
}