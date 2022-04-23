const { send } = require('process');
var userDatabase = require('./userDatabase');
var makeid = require('./makeid');

userDatabase.init();

function login(items, res){
    var username = items[0];
    var password = items[1];
    if(userDatabase.loginAttempt(username, password) == true){
        console.log('login succesful');
        res.writeHead(200, {'Content-Type': 'text/plain'});
        let newID = makeid(10);
        res.end('login succes ' + newID);
        userDatabase.userTokens[username] = newID;
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

function processRequest(message, address, res){
    tokens = message.split(' ');
    let header = tokens[0];
    tokens.shift();
    let items = tokens;
    switch(header){
        case "login": login(items, res); break;
        case "register": register(items, res); break;
    }
}

module.exports = processRequest;