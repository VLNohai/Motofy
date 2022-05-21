const internal = require("stream");
var fs = require('fs');
const userDatabase = require("./userDatabase");

class router{
    constructor(){
        this.ReqPairs = {};
    };

    addroute(request, func, hasArg=false){
        request.forEach(element => {
            this.ReqPairs[element] = {func : func, hasArg : hasArg};
        });
    }

    route(req, res){
        const URL = req.url.split('?')[0];
        const arg = req.url.split('?')[1];
        if(URL in this.ReqPairs)
        {
            if(this.ReqPairs[URL].hasArg){
                this.ReqPairs[URL].func(req, res, arg);
            }
            else{
                this.ReqPairs[URL].func(req, res)
            }
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
                    case 'jpg': res.writeHead(200, {'Content-Type': 'image/jpeg'}); break;
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