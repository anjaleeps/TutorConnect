const http = require('http');
const url = require('url');
var service = require('./service.js');

http.createServer(function(request, response) {
    const headers = {
        'Access-Control-Allow-Origin': 'http://localhost:8080',
        'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
        'Access-Control-Max-Age': 2592000 // 30 days   
    };

    var reqUrl = url.parse(request.url, true);
    var pathname = reqUrl.pathname;
    
    if (request.method === 'GET') {
        if (pathname === '/query.js') {
            service.handleQuery(request, response);
        }
        else {
            service.sendFiles(request, response);
        }
    }

    else if (request.method === 'POST') {
    }

    else if (request.method === 'OPTIONS') {
        service.handleOptions(request, response);
    }

    else {
        service.invalidRequest();
    }

}).listen(8080);