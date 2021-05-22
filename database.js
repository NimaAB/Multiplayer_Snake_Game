const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID; //not sure if will need it
const mongoURLDocker = "mongodb://groupe25:groupe25@mongodb";
const mongoClientOptions = {
    useNewUrlParser: true
};
const state = { db: null };

const dbName = "snake_game";

const connect = (callback)=>{
    if(state.db){
        callback();
    }else{
        MongoClient.connect(mongoURLDocker,mongoClientOptions,(err,client) => {
            if(err){
                callback(err);
            }else{
                status.db = client.db(dbName);
                callback();
            }
        });
    }
}

function getPrimaryKey(_id){ //not sure if will need it
    return ObjectID(_id);
}

function getDatabase(){
    return state.db;
}

module.exports = { getDatabase, getPrimaryKey, connect };