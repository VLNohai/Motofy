const { throws } = require("assert");
const makeid = require("./makeid");

class album{
    constructor(_title, _artist){
        this.title = _title;
        this.artist = _artist;
        this.songids = [];
        this.genres = [];
    }
}

class songdatabase{
    static songs = {};
    static songtitles = [];
    static songids = {};
    static albums = {};
    static genres = [];

    static addSong(newSong){
        this.songs[newSong.artist + "|" + newSong.title] = newSong;
        this.songtitles.push(newSong.artist + "|" + newSong.title);
    }

    static getSongsOfGenre(genre){
        let result = [];
        let albumNames = Object.keys(this.albums);
        albumNames.forEach(name => {
            let album = this.albums[name];
            album.genres.forEach(albumgenre => {
                if(albumgenre == genre){
                    album.songids.forEach(id => {
                        result.push(id);
                    });
                    result.push();
                }
            });
        });
        return result;
    }
}

module.exports = {songdatabase, album};