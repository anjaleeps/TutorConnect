const qs = require('querystring');
const url = require('url');
const userCtrl = require('../app/Users/UserController.js');

exports.handleRequests = function (request, response) {
    var pathname = url.parse(request.url, true).pathname;
    var dest = pathname.substr(pathname.indexOf('/', 1) + 1);
    if (request.method === 'POST') {
        let data = '';
        request.on('data', chunk => {
            data += chunk;
        });
        let params = qs.parse(data);

        switch (dest) {
            case 'Login':
                userCtrl.login(request, response, params);
                break;
            case 'Signin':
                userCtrl.signin(request, response, params);
                break;
            case 'Calendar/Tutor/Update':
                userCtrl.updateTutorCalendar(req, res, newfreeslot, params);
        }
    } else if (request.method == 'GET') {
        switch (dest) {
            case 'Calendar/Tutor/Update':
                userCtrl.updateTutorCalendar(req, res, newfreeslot, params);
        }
    }

}

exports.verifyToken = function (req, res) {
    userCtrl.verifyToken(req, res);
}