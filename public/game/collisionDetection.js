export function wallCollisions(game, snake) {
    let head = snake.posisions[snake.posisions.length - 1];
    let head_x_pos = head[0];
    let head_y_pos = head[1];

    return head_x_pos === 0
        || head_x_pos === snake.SPEED
        || head_x_pos === -snake.SPEED
        || head_x_pos === game.width - snake.SPEED
        || head_x_pos === game.width + snake.SPEED
        // up & down walls:
        || head_y_pos === 0
        || head_y_pos === snake.SPEED
        || head_y_pos === -snake.SPEED
        || head_y_pos === game.height - snake.SPEED
        || head_y_pos === game.height + snake.SPEED;
}

export function foodEaten(snake, food) {
    let head = snake.posisions[snake.posisions.length - 1];
    let head_x_pos = head[0];
    let head_y_pos = head[1];
    let food_x_pos = food.posision.x;
    let food_y_pos = food.posision.y;
    return (head_x_pos === food_x_pos && head_y_pos === food_y_pos)
        || (head_x_pos === food_x_pos + 2 && head_y_pos === food_y_pos)
        || (head_x_pos === food_x_pos - 2 && head_y_pos === food_y_pos)
        || (head_x_pos === food_x_pos && head_y_pos === food_y_pos + 2)
        || (head_x_pos === food_x_pos && head_y_pos === food_y_pos - 2);
}
