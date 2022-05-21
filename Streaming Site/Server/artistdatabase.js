const fs = require('fs');
const makeid = require('./makeid');
var songdatabase = require('./songdatabase').songdatabase;
const albumData = require('./songdatabase').album;
const { getAudioDurationInSeconds } = require('get-audio-duration');

const songdir = __dirname + "/../Client/Resources/Songs";

class song{
    constructor(_title, _artist, _album){
        this.title = _title;
        this.artist = _artist;
        this.album = _album;
        this.photoPath = "";
        this.URL = "Resources/Songs/" + _artist + "/" + _album +  "/" + _title + ".mp3";
        this.localPath = __dirname + "/../Client/" + this.URL;
        this.duration = 0;
        let newid = makeid(6);
        while(newid in songdatabase.songids){
        newid = lakeid(6);
        }
        this.id = newid;
        songdatabase.songids[newid] = this;

        getAudioDurationInSeconds(this.localPath).then(result => {
            songdatabase.songs[_artist + "|" + _title].duration = Math.ceil(result);
        });
        songdatabase.addSong(this);
    }
}

class artist{
    constructor(_name){
        this.name = _name;
        this.songs = [];
        let newid = makeid(6);
        while(newid in artistdatabase.artistids){
            newid = makeid(6);
        }
        this.id = newid;
        artistdatabase.artistids[newid] = this;
        this.photoPath = "";
        this.photoURL = "Resources/Songs/" + _name + "/";
    }
    
    addSong(newsong){
        this.songs.push(newsong);
    }
}

class artistdatabase{
    static artists = {};
    static artistnames = [];
    static artistids = {};

    static getPreviousIDForArtist(){
        let content = fs.readFileSync(__dirname + "/../Client/Resources/")
        
    }

    static getPreviousIDForSong(){
        
    }

    static scanSongs()
    {
        let names = fs.readdirSync(songdir)
        names.forEach(artistname => {
            let currentArtist = new artist(artistname);
            let albums = fs.readdirSync(songdir + "/" + artistname);
            albums.forEach(album => {
            let filetokens = album.split('.');
            if(filetokens[filetokens.length - 1] == 'jpg')
            {
                currentArtist.photoPath = songdir + '/' + artistname + '/' + album;
            }
            else
            {
            songdatabase.albums[album] = new albumData(album, artistname);
            let songs = fs.readdirSync(songdir + "/" + artistname + "/" + album);
            songs.forEach(file => {
                let filename = file.split('.')[0];
                let fileextension = file.split('.')[1];
                
                if(fileextension == 'jpg'){
                    songdatabase.albums[album].photoPath = 'Resources/Songs/' + artistname + '/' + album + '/' + file;
                }
                else
                if(fileextension == 'txt'){
                    let content = fs.readFileSync(songdir + "/" + artistname + "/" + album + '/Info.txt').toString();
                    let tokens = content.split(':')[1].split(',');
                    let genres = [];
                    tokens.forEach(genre => {
                        genres.push(genre);
                    });
                    songdatabase.albums[album].genres = genres;
                    genres.forEach(genre => {
                        if(!songdatabase.genres.includes(genre)){
                            songdatabase.genres.push(genre);
                        }
                    });
                }
                else
                {
                    let newsong = new song(filename, artistname, album);
                    currentArtist.addSong(newsong);
                    songdatabase.albums[album].songids.push(newsong.id);
                }
            });
            }
        });
            let tokens = currentArtist.photoPath.split('/');
            currentArtist.photoURL = currentArtist.photoURL + tokens[tokens.length - 1];
            artistdatabase.artists[currentArtist.name] = currentArtist;
            artistdatabase.artistnames.push(currentArtist.name);
        });
    }
}

module.exports = artistdatabase;