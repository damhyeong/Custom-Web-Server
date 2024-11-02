const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path")



const routes = {
    "/" : "/index.html",
}

const server = http.createServer(function (req, res) {
    const {url} = req;

    console.log(url);

    if(url === "/favicon.ico"){
        res.status = 404;
        return res.end();
    }

    if(url === "/"){
        fs.readFile("index.html", function(err, data) {
            if(err){
                res.writeHead(500);
                res.end("Error loading index.html")
            } else {
                res.writeHead(200, {"Content-Type" : "text/html"});
                res.end(data);
            }
        })
    } else if(url === "/App.js"){
        fs.readFile("App.js", function(err, data) {
            if(err){
                res.writeHead(500);
                res.end("Error loading index.html")
            } else {
                res.writeHead(200, {"Content-Type" : "text/javascript"});
                res.end(data);
            }
        })
    } else {
        const newUrl = url.slice(1, url.length);

        const ext = path.extname(url).toLowerCase();
        fs.readFile(newUrl, function (err, data) {
            if(err) {
                res.writeHead(500);
                res.end(`Error loading ${url}`);
            } else {
                if(ext === ".js" || ext === ".mjs"){
                    res.writeHead(200, {"Content-Type" : "application/javascript"});
                    res.end(data);
                } else if(ext === ".css") {
                    res.writeHead(200, {"Content-Type" : "text/css"})
                    res.end(data);
                }

            }
        })
    }



});


server.listen(3000);