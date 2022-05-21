var makeid = require('./makeid');

class roomdatabase{
    static rooms = {}
    static addroom(room){
        roomdatabase.rooms[room.id] = room;
    }
}

class room{
    constructor(_songid, _admin){
        this.admin = _admin;
        this.songid = _songid
        this.second = 0;
    }
    start(){
        this.id = makeid(6);
        while(this.id in roomdatabase.rooms){
            this.id = makeid(6);
        }
        roomdatabase.addroom(this);
    }
}

module.exports = { roomdatabase, room };