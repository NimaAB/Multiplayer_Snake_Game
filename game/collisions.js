module.exports = {
    collidedToWall,
    collidedToSnake,
    collidedToFood,
    collidedToSelf
}

function collidedToWall(snake_head, grid_size){
    if(snake_head.x < 0 || snake_head.x >grid_size || snake_head.y < 0 || snake_head.y > grid_size){
        return true;
    }
}

function collidedToFood(snake_head, food_pos){
    if(snake_head.x === food_pos.x && snake_head.y === food_pos.y){
        return true
    }
}

function collidedToSelf(snake_head, snake_body){
    for(let part of snake_body){
        if(snake_head.x === part.x && snake_head.y === part.y){
            return true;
        }
    }
}

function collidedToSnake(){
    //TODO: implementering
    return false;
}