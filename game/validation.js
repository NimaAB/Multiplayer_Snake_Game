
module.exports = { isPlayerNameValid, playerAlreadyActive };

function isPlayerNameValid(name){
    const name_format = /^[a-zåøæA-ZÅØÆ0-9]{1,15}[_\.\* ]{0,2}$/;
    return name_format.test(name);
}

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