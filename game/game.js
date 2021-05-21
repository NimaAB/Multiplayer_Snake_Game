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
        
        let theCollidedFood = collidedToFood(player.position, state.foods);
        if(theCollidedFood !== -1){
            player.points += theCollidedFood[0].point;
            player.snake_body.push({...player.position}); //legger hode koordinatene på hallen
            player.position.x += player.velocity.x;
            player.position.y += player.velocity.y;
            newFood(state, theCollidedFood[1]);
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
        foods: [
            {
                type: chooseFoodType(),
                position: {x: 9, y: 10}
            },
            {
                type: chooseFoodType(),
                position: {x: 2, y: 18}
            },
            {
                type: chooseFoodType(),
                position: {x: 18, y: 6}
            }
        ],
        grid_size: GRID_SIZE
    };
}

function chooseFoodType(){

    const foodTypes = [
        {
            point:1, 
            color:"#C63B59FF",
            name: 'apple'
        },
        {
            point:3, 
            color:"#3B69C6",
            name: 'kiwi'
        }
    ]
    let index = Math.floor(Math.random()*4);

    if(index===3){
        return foodTypes[1];
    }else{
        return foodTypes[0];
    }
}

function newFood(state, index){
    const position = {
        x: Math.floor(Math.random()*GRID_SIZE),
        y: Math.floor(Math.random()*GRID_SIZE)
    };

    //sjekker om maten er ikke på en rute som en slage ligger på.
    for(let player of state.players){
        player.snake_body.forEach((snake_part) =>{
            if(position.x === snake_part.x && position.y === snake_part.y){
                return newFood(state);
            }
        });
    }
    const food = {
        type: chooseFoodType(),
        position: position
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
    const colors = [
        "#246a73", '#ea7317', '#38b000', '#a167a5',
        "#c08497", '#c9a227', '#38b000', '#00b2ca',
        '#ff499e',"#30a64f","#ad6a6c","#8390fa"];
    const len = colors.length;
    return colors[Math.floor(Math.random()*len)];
}