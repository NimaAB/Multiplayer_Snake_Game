const { GRID_SIZE } = require('./consts.js');
const { collidedToWall, collidedToSnake, collidedToFood } = require('./collisions.js');

module.exports = { createGameState, gameLoop, updateVelocity, createPlayer }

function gameLoop(state){
    if(!state) return;
    for(let player of state.players){
        player.position.x += player.velocity.x;
        player.position.y += player.velocity.y;

        if(collidedToWall(player.position, GRID_SIZE)){
            return player;
        }
        if(collidedToFood(player.position, state.food)){
            player.points += 1;
            player.snake_body.push({...player.position}); //legger hode koordinatene på hallen
            player.position.x += player.velocity.x;
            player.position.y += player.velocity.y;
            newFood(state);
        }

        if(player.velocity.x || player.velocity.y){
            if(collidedToSnake(player, state.players)){
                return player;
            }
            player.snake_body.push({...player.position}) //legger hode koordinatene på hallen
            player.snake_body.shift();
        }
    }
    return false;
}

function createPlayer(x,y, client_id){
    return {
        id: client_id,
        points: 0,
        position: {
            x: x,
            y: y,
        },
        velocity: {
            x: 1,
            y: 0
        },
        snake_body: [
            {x: x, y: y},
        ],
    }
}

function createGameState(){
    return  {
    players: [],
    food: {
        x: 9,
        y: 9
    },
    grid_size: GRID_SIZE
    };
}

function newFood(state){
    let food = {
        x: Math.floor(Math.random()*GRID_SIZE),
        y: Math.floor(Math.random()*GRID_SIZE)
    };

    //sjekker om maten er ikke på en rute som en slage ligger på.
    for(let player of state.players){
        player.snake_body.forEach((snake_part) =>{
            if(food.x === snake_part.x && food.y === snake_part.y){
                return newFood(state);
            }
        });
    }
    state.food = food;
}

function updateVelocity(key_name, velocity){
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