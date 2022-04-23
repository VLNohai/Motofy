const internal = require("stream");
var fs = require('fs');
const userDatabase = require("./userDatabase");

class router{
    constructor(){
        this.ReqPairs = {};
    };

    addroute(request, protection, func){
        request.forEach(element => {
            this.ReqPairs[element] = {func: func, protection: protection};
        });
    }

    route(req, res){
        if(req.url in this.ReqPairs)
        {
            if(this.ReqPairs[req.url].protection == true)
            {
                let body = '';
                req.on('data', (chunk) => {
                body += chunk;
            })
                if(!(body in userDatabase.userTokens) && 1==2)
                {
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    fs.createReadStream(__dirname + '/../Client/Error.html').pipe(res);
                    return;
                }
            }
            this.ReqPairs[req.url].func(req, res);
        }
        else
        {
            let path = __dirname + '/../Client' + req.url;
            if(fs.existsSync(path))
            {
                let tokens = path.split('.');
                let extension = tokens[tokens.length - 1];
                switch(extension){
                    case 'html': res.writeHead(200, {'Content-Type': 'text/html'}); break;
                    case 'css': res.writeHead(200, {'Content-Type': 'text/css'}); break;
                    case 'js': res.writeHead(200, {'Content-Type': 'text/javascript'}); break;
                }
                fs.createReadStream(path).pipe(res);
            }
            else
            {
                res.end();
            }
        }
    }
}

module.exports = router;