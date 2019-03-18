const fs = require('fs');
const db = require('./database.js');
const url = require('url');
const qs = require('querystring');

exports.sendFiles = function (request, response) {
    var reqUrl = url.parse(request.url, true);
    var pathname = reqUrl.pathname;

    var filename;
    if (pathname == '/') {
        filename = '../student/Second.html';
    }
    else {
        filename = '..' + pathname;
    }

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
                    '.js': 'text/javascript'
                }[filename.substr(dotoffset)];
      
            response.writeHead(200, { 'Content-Type': mimetype });
            response.end(data);
        }
        else {
            if (request.url != '/favicon.ico') {
                console.log('file not found: ' + request.url);
                response.writeHead(404, "Not Found");
                response.end();
            }
            response.end();
        }
    });
}

exports.handleQuery = function (request, response) {
    var queryUrl = url.parse(request.url, true);
    var action = queryUrl.query.action;
    console.log(action);
    switch (action) {
        case 'searchTutors':
            db.searchTutors(queryUrl, function (err, results) {
                if (err) { console.log(err) }
                response.writeHead(200, { 'Content-Type': 'application/json' });
                response.write(JSON.stringify(results));
                response.end();
            });
            break;
        case 'getCalInfo':
            db.getCalInfo(queryUrl, function (err, events) {
                if (err) { console.log(err) }
                response.writeHead(200, { 'Content-Type': 'application/json' });
                response.write(JSON.stringify(events));
                response.end();
            });
            break;
        case 'getFreeSlots':
            db.getFreeSlots(queryUrl, function (err, results) {
                if (err) { console.log(err) }
                response.writeHead(200, { 'Content-Type': 'application/json' });
                response.write(JSON.stringify(results));
                response.end();
            });
            break;
        case 'goToProfile':
            db.goToProfile(queryUrl, function (err, results) {
                if (err) { console.log(err) }
                response.writeHead(200, { 'Content-Type': 'application/json' });
                response.write(JSON.stringify(results));
                response.end();
            });
            break;
         case 'searchlevel':
            db.searchlevel(queryUrl, function (err, results) {
                if (err) { console.log(err) }
                response.writeHead(200, { 'Content-Type': 'application/json' });
                response.write(JSON.stringify(results));
                response.end();
            });
            break;  
           
        case 'searchsubject':
            db.searchsubject(queryUrl, function (err, results) {
                if (err) { console.log(err) }
                response.writeHead(200, { 'Content-Type': 'application/json' });
                response.write(JSON.stringify(results));
                response.end();
            });
            break;  
        default:
            console.log('Invalid Query');
           
    }
}

exports.handlePost= function(data,response){
    let params = qs.parse(data);
    let action = params.action;

    switch (action) {
        case 'removeTimeslot':
            db.removeTimeslot(params, function (err, results) {
                if (err) { console.log(err) }
                response.end();
            });
            break;
        case 'addTimeslot':
            db.addTimeslot(params, function (err, results) {
                if (err) { console.log(err) }
                response.end(results);
            });
            break;
        default:
            console.log('Invalid Query');
            
    }
}

exports.invalidRequest = function (request, response) {
    console.log('Invalid method');
    res.writeHead(405,'Content-Type', 'text/plain');
    res.end('Invalid Request');
}
