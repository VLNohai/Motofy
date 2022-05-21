var http = require('http');
var fs = require('fs');
var express = require('express');
var app = express();
var router = require('./router');
const processRequest = require('./processRequest');
const fileupload = require('express-fileupload')
var artistdatabase = require('./artistdatabase');
const songdatabase = require('./songdatabase').songdatabase;
const userDatabase = require('./userDatabase');
const { isNullOrUndefined } = require('util');
const { roomdatabase } = require('./roomdatabase');

var myRouter = new router();

myRouter.addroute(['/', '/login'], (req, res) => {
    res.writeHead(200, {'Content-Type': 'text/html'});
    fs.createReadStream(__dirname + '/../Client/login.html').pipe(res);
})

myRouter.addroute(['/register'], (req, res) => {
    res.writeHead(200, {'Content-Type': 'text/html'});
    fs.createReadStream(__dirname + '/../Client/register.html').pipe(res);
})

myRouter.addroute(['/artistlist'], (req, res) => {
    res.writeHead(200, {'Content-Type': 'text/html'});
    fs.createReadStream(__dirname + '/../Client/artistlist.html').pipe(res);
})

myRouter.addroute(['/watch'], (req, res, arg) => {
    res.writeHead(200, {'Content-Type': 'text/html'});
    if(arg == null || arg == undefined)
        fs.createReadStream(__dirname + '/../Client/artistlist.html').pipe(res);
    else
    if(arg in songdatabase.songids)
        fs.createReadStream(__dirname + '/../Client/watch.html').pipe(res);
    else
        fs.createReadStream(__dirname + '/../Client/Error.html').pipe(res);
}, true)

myRouter.addroute(['/shared'], (req, res, arg) => {
    res.writeHead(200, {'Content-Type': 'text/html'});
    if(arg == null || arg == undefined)
        fs.createReadStream(__dirname + '/../Client/artistlist.html').pipe(res);
    else
    if(arg in roomdatabase.rooms)
        fs.createReadStream(__dirname + '/../Client/watch.html').pipe(res);
    else
        fs.createReadStream(__dirname + '/../Client/Error.html').pipe(res);
}, true)

myRouter.addroute(['/artist'], (req, res, arg) => {
    res.writeHead(200, {'Content-Type': 'text/html'});

    if(arg == null || arg == undefined)
        fs.createReadStream(__dirname + '/../Client/artistlist.html').pipe(res);
    else
    if(arg in artistdatabase.artistids)
        fs.createReadStream(__dirname + '/../Client/artist.html').pipe(res);
    else
        fs.createReadStream(__dirname + '/../Client/Error.html').pipe(res);
}, true)

myRouter.addroute(['/home'], (req, res) => {
    res.writeHead(200, {'Content-Type': 'text/html'});
    fs.createReadStream(__dirname + '/../Client/home.html').pipe(res);
})

myRouter.addroute(['/account'], (req, res) => {
    res.writeHead(200, {'Content-Type': 'text/html'});
    fs.createReadStream(__dirname + '/../Client/account.html').pipe(res);
})

artistdatabase.scanSongs();

var server = http.createServer(function(req, res){
    console.log(req.url);
    address = req.socket.remoteAddress;
    if(req.url == '/query')
    {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk;
        })
        req.on('end', () => {
            processRequest(body, address, res);
        })
    }
    else
    {
            myRouter.route(req, res);
    }
});

server.listen(3000, 'localhost');
console.log('Server up and running');