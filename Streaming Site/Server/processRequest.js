var userDatabase = require('./userDatabase');
var artistdatabase = require('./artistdatabase');
var makeid = require('./makeid');
const songdatabase = require('./songdatabase').songdatabase;
const { type } = require('express/lib/response');
const { createBrotliCompress } = require('zlib');
const { roomdatabase, room } = require('./roomdatabase');
const { album } = require('./songdatabase');

userDatabase.init();

function underscoresToSpaces(word)
{
    ret = word.replaceAll("_", " ");
    return ret;
}

function login(items, res){
    var username = items[0];
    var password = items[1];
    if(userDatabase.loginAttempt(username, password) == true){
        console.log('login succesful');
        res.writeHead(200, {'Content-Type': 'text/plain'});
        let newID = makeid(10);
        while(newID in userDatabase.userTokens)
        {
            newID = makeid(10);
        }
        userDatabase.userTokens[newID] = userDatabase.users[username];
        console.log(username + ' is assigned as ' + newID);
        res.end('login succes ' + newID);
    }
    else
    {
        console.log('failed');
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('login failed');
    }
}

function register(items, res){
    var username = items[0];
    var password = items[1];
    if(userDatabase.userExists(username))
    {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('register failed');
    }
    else
    {
        userDatabase.addUser(username, password);
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('register succes');
    }
}

function giveSong(items, res)
{
    let song = songdatabase.songids[items[0]];
    console.log(songdatabase.albums[song.album].genres);
    if(items.length == 2){
        let user = userDatabase.userTokens[items[1]];
        if(user != null && user != undefined){
            user.addToHistory(song.id);
        }
        else console.log('user not found!');
    }
    else console.log('user not logged!');
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end(song.title + '%' + song.artist + '%' + song.album + '%' + songdatabase.albums[song.album].photoPath + '%' + song.duration);
}

function matchWordInList(word, list)
{
    let matchedElements = [];
    word = word.toLowerCase();
    list.forEach(element => {
        if(element.toLowerCase().includes(word)){
            matchedElements.push(element);
        }
    });
    return matchedElements;
}

function giveArtistList(items, res)
{
    res.writeHead(200, {'Content-Type': 'application/json'});
    if(items[0] == 'search')
    {
        userInput = items[1];
        let matches = matchWordInList(userInput, artistdatabase.artistnames);
        let message = "";
        matches.forEach(artist => {
            message += artist + '%' + artistdatabase.artists[artist].id + '%' + artistdatabase.artists[artist].photoURL;
            message += '|';
        });
        message = message.slice(0, -1);
        res.end(message);
    }
}

function giveSongList(items, res)
{
    targetArtist = artistdatabase.artistids[items[0]];
    targetSongs = targetArtist.songs;
    let message = underscoresToSpaces(targetArtist.name) + '$';
    for(let i=0; i<targetSongs.length; i++)
    {
        message += underscoresToSpaces(targetSongs[i].title) + '%' + underscoresToSpaces(targetSongs[i].album) + '%' + targetSongs[i].id + '|'
    }
    message = message.slice(0, -1);
    res.end(message);
}

function giveAlbum(items, res)
{
    let song = songdatabase.songids[items[0]];
    console.log(song);
    let albumsongs = songdatabase.albums[song.album].songids;
    let message = "albumsongs ";
    albumsongs.forEach(songid => {
        message += songid + "%" + songdatabase.songids[songid].title + "|"
    });
    message = message.slice(0, -1);
    res.end(message);
}

function recommend(items, res)
{
    if(items[0] == 'artists' || items[0] == 'songs'){
        let indices = [];
        while(indices.length < 4){
            let index = Math.floor(Math.random() * artistdatabase.artistnames.length);
            if(!indices.includes(index))
            indices.push(index);
        }
        let message = "";

        if(items[0] == 'artists')
        {
            indices.forEach(index => {
                let name = artistdatabase.artistnames[index];
                message += name + "%" + artistdatabase.artists[name].photoURL + "%" + artistdatabase.artists[name].id;
                message += '|';
            });
            message = 'artists ' + message.slice(0, -1);
        }
        else
        {
            let indices = [];
            var songindex;
            for(let i=0; i<4; i++){
                if(items.length == 2 && items[1] in userDatabase.userTokens){
                    let user = userDatabase.userTokens[items[1]];
                    let sum = 0;
                    let keys = Object.keys(user.preferences)
                    keys.forEach(key => {
                        sum += user.preferences[key];
                    });
                    let intervals = [5]
                    let labels = ['ANY'];
                    let last = 5;
                    keys.forEach(key => {
                        let value = (user.preferences[key] / sum * 95) + last;
                        labels.push(key);
                        last = value;
                        intervals.push(value);
                    });
                    let i=0;
                    let dice = Math.random() * 100;
                    //console.log(intervals);
                    //console.log(dice);
                    while(dice > intervals[i]){
                        i++;
                    }
                    let diceGenre = labels[i];
                    if(diceGenre == 'ANY')
                    {
                        songindex = Math.floor(Math.random() * songdatabase.songtitles.length);
                        while(indices.includes(songindex)){
                        songindex = Math.floor(Math.random() * songdatabase.songtitles.length);
                        }
                    }
                    else
                    {
                        let pool = songdatabase.getSongsOfGenre(diceGenre);
                        let localindex = Math.floor(Math.random() * pool.length);
                        let song = songdatabase.songids[pool[localindex]];
                        songindex = songdatabase.songtitles.indexOf(songdatabase.albums[song.album].artist + '|' + song.title);
                        while(indices.includes(songindex)){
                            localindex = Math.floor(Math.random() * pool.length);
                            song = songdatabase.songids[pool[localindex]];
                            songindex = songdatabase.songtitles.indexOf(songdatabase.albums[song.album].artist + '|' + song.title);
                        }
                    }
                }
                else
                {
                    songindex = Math.floor(Math.random() * songdatabase.songtitles.length);
                    while(indices.includes(songindex)){
                        songindex = Math.floor(Math.random() * songdatabase.songtitles.length);
                    }
                }
                indices.push(songindex);
                let song = songdatabase.songs[songdatabase.songtitles[songindex]];
                let artistname = songdatabase.songtitles[songindex].split('|')[0];
                message += artistname + '-' + song.title + '%' + songdatabase.albums[song.album].photoPath + "%" + song.id;
                message +='|';
            }
            message = 'songs ' + message.slice(0, -1);
        }
        console.log(message);
        res.end(message);
        return;
    }
    if(items[0] == 'hist'){
        if(items.length == 2){
            if(items[1] in userDatabase.userTokens){
                let user = userDatabase.userTokens[items[1]];
                let hist = user.history;
                let message = 'hist ';
                hist.forEach(item => {
                    let song = songdatabase.songids[item];
                    message += song.artist + '-' + song.title + '%' + songdatabase.albums[song.album].photoPath + "%" + song.id;
                    message += '|';
                });
                message = message.slice(0, -1);
                res.end(message);
                return;
            }
        }
        res.end('hist');
    }
}

function giveProfileInfo(items, res){
    let message = "";
    if(items.length == 1 && items[0] in userDatabase.userTokens){

        let user = userDatabase.userTokens[items[0]];
        message += user.username + " ";

        if(user.profilePhotoURL == 'not set')
            message += 'Resources/userPhotos/default.jpg';
        else
            message += user.profilePhotoURL;
        res.end(message);
        return;
    }
    message= 'Not_logged_in';
    res.end(message);
}

function createRoom(items, res){
    let newroom = new room(items[0], items[1]);
    res.end("roomid " + newroom.id); 
}

function updateRoom(items, res){
    let roomID = items[0];
    let songID = items[1];
    let clock = items[2];
    let paused = items[3];

    let room = roomdatabase.rooms[roomID];
    room.clock = clock;
    room.songid = songID;
    room.paused = paused;
    console.log(clock + " " + songID + " " + paused);
    res.end('ok');
}

function giveRoom(items, res){
    let room = roomdatabase.rooms[items[0]];
    let message = "roomstate " + room.songid + " " + room.clock + " " + room.paused;
    res.end(message);
}


function processRequest(message, address, res){
    tokens = message.split(' ');
    let header = tokens[0];
    tokens.shift();
    let items = tokens;
    switch(header){
        case "login": login(items, res); break;
        case "register": register(items, res); break;
        case "song": giveSong(items, res); break;
        case "album": giveAlbum(items, res); break;
        case "artists": giveArtistList(items, res); break;
        case "songs": giveSongList(items, res); break;
        case "recommend": recommend(items, res); break;
        case "profile": giveProfileInfo(items, res); break;
        case "room": createRoom(items, res); break;
        case "updateRoom": updateRoom(items, res); break;
        case "getroom": giveRoom(items, res); break;
    }
}

module.exports = processRequest;