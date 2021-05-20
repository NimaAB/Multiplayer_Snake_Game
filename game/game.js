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
        let food_index = collidedToFood(player.position, state.foods);
        if(food_index !== -1){
            player.points += 1;
            player.snake_body.push({...player.position}); //legger hode koordinatene på hallen
            player.position.x += player.velocity.x;
            player.position.y += player.velocity.y;
            newFood(state, food_index);
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

function createPlayer(playerName, client_id){
    return {
        id: client_id,
        playerName: playerName,
        points: 0,
        best_score: 0,
        color: getRandomColor(),
        position: {
            x: Math.floor(Math.random() * 25) + 2,
            y: Math.floor(Math.random() * 30)
        },
        velocity: {
            x: 1,
            y: 0
        },
        snake_body: [
            {
                x: 0,
                y: 0
            },
        ],
    }
}

function createGameState(){
    return  {
    players: [],
    foods: [{x: 9, y:9},
        {x: 10, y:10 },
        {x: 11, y:11 },
    ],

    grid_size: GRID_SIZE
    };

}

function newFood(state, index){
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

    state.foods[index] = food;
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

function getRandomColor(){
    const colors = ["#A8F6EEFF", 'gold', 'yellowgreen', 'orange', 'lavender'];
    const len = colors.length;
    return colors[Math.floor(Math.random()*len)];
}
