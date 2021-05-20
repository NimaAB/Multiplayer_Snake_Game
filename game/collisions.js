module.exports = {
    collidedToWall,
    collidedToSnake,
    collidedToFood,
}

function collidedToWall(snake_head, grid_size){
    if(snake_head.x < 0 || snake_head.x > grid_size || snake_head.y < 0 || snake_head.y > grid_size){
        return true;
    }
}

function collidedToFood(snake_head, foods){
    for (let food of foods){
        if(snake_head.x === food.x && snake_head.y === food.y) {
            return foods.indexOf(food);
        }
    }
}

function collidedToBody(snake_head, snake_body){
    for(let part of snake_body){
        if(snake_head.x === part.x && snake_head.y === part.y){
            return true;
        }
    }
}

function collidedToSnake(player, enemies){
    // Teller også collision med seg selv
    for(let enemy of enemies){
        if(collidedToBody(player.position, enemy.snake_body)) {
            if(enemy.id !== player.id){
                enemy.points += player.points;
                return true;
            }
        }
    }
    return false;
}