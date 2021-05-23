module.exports = { playerAlreadyActive };

function playerAlreadyActive(player_id, gameState){
    let playerActive = false;
    for(let player of gameState.players) {
        if(player.id === player_id) {
            playerActive = true;
            break;
        }
    }
    return playerActive;
}