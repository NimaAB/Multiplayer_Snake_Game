
module.exports = { isPlayerNameValid }; 

function isPlayerNameValid(name){
    const name_format = /^[a-zåøæA-ZÅØÆ0-9]{1,15}[_\.\* ]{0,2}$/;
    if(name_format.test(name)){
        return true;
    }
    return false;
}