var http = require('http');
var fs = require('fs');
var router = require('./router');
const processRequest = require('./processRequest');
;
var myRouter = new router();

myRouter.addroute(['/', '/login'], false, (req, res) => {
    res.writeHead(200, {'Content-Type': 'text/html'});
    fs.createReadStream(__dirname + '/../Client/login.html').pipe(res);
})

myRouter.addroute(['/register'], false, (req, res) => {
    res.writeHead(200, {'Content-Type': 'text/html'});
    fs.createReadStream(__dirname + '/../Client/register.html').pipe(res);
})

myRouter.addroute(['/home'], true, (req, res) => {
    res.writeHead(200, {'Content-Type': 'text/html'});
    fs.createReadStream(__dirname + '/../Client/home.html').pipe(res);
})

myRouter.addroute(['/watch'], true, (req, res) => {
    res.writeHead(200, {'Content-Type': 'text/html'});
    fs.createReadStream(__dirname + '/../Client/watch.html').pipe(res);
})

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

server.listen(3000, '127.0.0.1');
console.log('Server up and running');