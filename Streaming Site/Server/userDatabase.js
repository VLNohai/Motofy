const fs = require('fs');

class user{
    constructor(username, password){
        this.username = username;
        this.password = password;
    }
}

class userDatabase{
    static users = {};
    static userTokens = {};
    constructor(){};

    static init(){
        const allFileContents = fs.readFileSync('Server\\userlist.txt', 'utf-8');
        var lines = allFileContents.split(/\r?\n/);
        lines.forEach(line => {
            var credentials = line.split(' ');
            this.users[credentials[0]] = new user(credentials[0], credentials[1]);
        });
    }

    static rewriteFile(){
        var keys = Object.keys(this.users);
        let data = "";
        keys.forEach(key=>{
                data += key + " " + this.users[key].password + '\n';
            });
            fs.writeFileSync('Server\\userlist.txt', data);
    }

    static addUser(username, password){
        this.users[username] = new user(username, password);
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