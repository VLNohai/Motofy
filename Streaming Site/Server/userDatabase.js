const { throws } = require('assert');
const { Console } = require('console');
const fs = require('fs');
const songdatabase = require('./songdatabase').songdatabase;

class user{
    constructor(username, password){
        this.username = username;
        this.password = password;
        this.history = [];
        this.preferences = {};
        this.profilePhotoURL = 'not set';
    }

    addToHistory(songid){
        if(!this.history.includes(songid)){
            this.history.unshift(songid);
            if(this.history.length > 4){
                this.history.pop()
            }
        }
        else{
            let aux = this.history[this.history.indexOf(songid)];
            this.history[this.history.indexOf(songid)] = this.history[0];
            this.history[0] = aux;
        }
        let song = songdatabase.songids[songid];
        let genres = songdatabase.albums[song.album].genres;
        genres.forEach(genre => {
            this.preferences[genre] += 1;
        });
        userDatabase.rewriteFile();
    }
}

class userDatabase{
    static users = {};
    static userTokens = {};
    constructor(){};

    static init(){
        const allFileContents = fs.readFileSync('Server\\userlist.txt', 'utf-8');
        let lines = allFileContents.split(/\r?\n/);
        lines.forEach(line => {
            let sections = line.split('|')
            let credentials = sections[0].split(' ');
            this.users[credentials[0]] = new user(credentials[0], credentials[1]);
            if(sections.length > 2){
                let preferences = sections[2].split('%');
                preferences.forEach(pref => {
                    let tokens = pref.split(':');
                    let genre = tokens[0];
                    let count = parseInt(tokens[1]);
                    this.users[credentials[0]].preferences[genre] = count;
                });
            }
        });
    }

    static rewriteFile(){
        var keys = Object.keys(this.users);
        let data = "";
        keys.forEach(key=>{
                data += key + " " + this.users[key].password + '|';
                let hist = this.users[key].history;
                for(let i=0; i<hist.length; i++){
                    data += " " + hist[i];
                }
                data += '|';
                let pref = Object.keys(this.users[key].preferences);
                pref.forEach(genre => {
                    data += genre + ':' + this.users[key].preferences[genre] + '%';
                });
                data = data.slice(0, -1);
                data += '\n';
            });
            fs.writeFileSync('Server\\userlist.txt', data);
    }

    static addUser(username, password){
        this.users[username] = new user(username, password);
        songdatabase.genres.forEach(genre => {
            this.users[username].preferences[genre] = 0;
        });
        this.rewriteFile();
    }

    static userExists(username){
        return username in this.users;
    }

    static loginAttempt(username, password){
        if(username in this.users){
            return password == this.users[username].password;
        }
        else
        {
            return false;
        }
    }
}

module.exports = userDatabase;