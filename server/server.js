var http = require('http');
var fs = require('fs');
var url = require('url');
var searchTutors = require('./database.js').searchTutors;

http.createServer(function (request, response) {
    const headers = {
        'Access-Control-Allow-Origin': 'http://localhost:8080',
        'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
        'Access-Control-Max-Age': 2592000 // 30 days
        
    };
    console.log(request.url);
    var address = request.url;
    var q = url.parse(address, true);
    console.log(q.query.action);

    if (q.query.action == 'searchTutors') {
        console.log('action:reached');
        searchTutors(request.url, function (err, results) {
            if (err) { console.log(err) }

            response.writeHead(200, { 'Content-Type': 'application/json' });
            response.write(JSON.stringify(results));
            response.end();
        });
    }

    else {
        switch (request.url) {
            case "/":
                fs.readFile('../student/Second.html', function (err, data) {
                    if (!err) {
                        response.writeHead(200, { 'Content-Type': 'text/html' });
                        response.write(data);
                        response.end();
                    } else {
                        console.log('file not found: ' + request.url);
                        response.writeHead(404, "Not Found");
                        response.end();
                    }
                });
                break;


            default:

                fs.readFile('../student' + request.url, function (err, data) {
                    if (!err) {
                        var dotoffset = request.url.lastIndexOf('.');
                        var mimetype = dotoffset == -1
                            ? 'text/plain'
                            : {
                                '.html': 'text/html',
                                '.ico': 'image/x-icon',
                                '.jpg': 'image/jpeg',
                                '.png': 'image/png',
                                '.gif': 'image/gif',
                                '.css': 'text/css',
                                '.js': 'text/javascript'
                            }[request.url.substr(dotoffset)];
                        console.log(mimetype);
                        response.writeHead(200, { 'Content-Type': mimetype });
                        response.end(data);
                        console.log(request.url, mimetype);
                    } else {
                        console.log('file not found: ' + request.url);
                        response.writeHead(404, "Not Found");
                        response.end();
                    }
                });
        }
    }

}).listen(8080);