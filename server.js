const http = require('http');
const url = require('url');

const infoCtrl = require('./Controllers/InfoController.js');
const sessionCtrl = require('./Controllers/SessionController.js');
const classCtrl = require('./Controllers/ClassController.js');
const fileCtrl = require('./Controllers/FileController.js');

http.createServer(function (request, response) {
    const headers = {
        'Access-Control-Allow-Origin': 'http://localhost:8080',
        'Access-Control-Allow-Methods': 'OPTIONS, POST, GET, PATCH, DELETE',
        'Access-Control-Max-Age': 2592000 // 30 days   
    };
    if (request.headers.authorization) {
        sessionCtrl.verifyToken(request, response);

    } else {
        request.access_token = null;
    }

    var reqUrl = url.parse(request.url, true);
    var pathname = reqUrl.pathname;
    
    if (pathname.includes('Users')) {
        sessionCtrl.handleRequest(request, response);
    }
    else if (pathname.includes('Info')) {
        infoCtrl.handleRequest(request, response);
    }
    else if (pathname.includes('Class')) {
        classCtrl.handleRequest(request, response);
    }
    else {
        fileCtrl.sendFiles(request, response);
    }

    if (request.method === 'OPTIONS') {
        response.writeHead(200);
        response.end();
    }

    else {
        
    }

}).listen(8080);

