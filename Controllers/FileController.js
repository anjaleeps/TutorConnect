const fs = require('fs');
const url = require('url');

exports.sendFiles = function (request, response) {
    var reqUrl = url.parse(request.url, true);
    var pathname = reqUrl.pathname;

    var filename;
    if (pathname == '/') {
        filename = './web/index.html';
    }
    else {
        filename = './web' + pathname;
    }
    console.log(filename);
    fs.readFile(filename, function (err, data) {
        if (!err) {
            var dotoffset = filename.lastIndexOf('.');
            var mimetype = dotoffset == -1
                ? 'text/plain'
                : {
                    '.html': 'text/html',
                    '.ico': 'image/x-icon',
                    '.jpg': 'image/jpeg',
                    '.png': 'image/png',
                    '.gif': 'image/gif',
                    '.css': 'text/css',
                    '.js': 'text/javascript',
                    '.svg': 'image/svg+xml',
                    '.woff2': 'font/woff2'
                }[filename.substr(dotoffset)];
            
            response.writeHead(200, { 'Content-Type': mimetype });
            response.end(data);
        }
        else {
            //console.log(err);
            if (request.url != '/favicon.ico') {
                console.log('file not found: ' + filename);
                response.writeHead(404, "Not Found");
                response.end();
            }
        }
    });
}

