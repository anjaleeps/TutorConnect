const qs = require('querystring');
const url = require('url');
const userCtrl = require('../app/Users/UserController.js');
const moduleCtrl = require('../app/Modules/ModuleController.js')

exports.handleRequests = function (request, response) {
    var parse = url.parse(request.url, true);
    var pathname = parse.pathname;
    var dest = pathname.substr(pathname.indexOf('/',1)+1);
    if (request.method == 'GET') {
        var query = parse.query;
        switch (dest) {
            case 'Tutor/Requests':
                moduleCtrl.getRequests(request, response, query.tutorId);
                break;
            case 'Tutor/Request/Delete':
                moduleCtrl.deleterequest(request, response, query.studentId, query.tutorId);
                break;
            case 'Tutor/Start':
                moduleCtrl.startClass(request, response, query.newClass);
                break;
            case 'Tutor/Start/Time':
                userCtrl.getFreeSlots(request, response, query.tutorId);
                break;
        }
        
    }
}
