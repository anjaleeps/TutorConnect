const qs = require('querystring');
const url = require('url');
const userCtrl = require('../app/Users/UserController.js');

exports.handleRequest = function (request, response) {
    var parse = url.parse(request.url, true);
    var pathname = parse.pathname;
    var dest = pathname.substr(pathname.indexOf('/', 1) + 1);
    if (request.method === 'POST') {
        let data = '';
        request.on('data', chunk => {
            data += chunk;
        });
        request.on('end', () => {
            let params = qs.parse(data);

            switch (dest) {
                case 'Login':
                    userCtrl.login(request, response, params);
                    break;
                case 'Signin':
                    userCtrl.signin(request, response, params);
                    break;
            }
        });
    }
    else if (request.method ==="GET"){
        var query = parse.query;
        switch(dest){
            case 'Verify':
                userCtrl.isSameUser(request, response, query.userId);
                break;
        }
    }

}

exports.verifyToken = function(request, response){
    userCtrl.verifyToken(request, response);
}