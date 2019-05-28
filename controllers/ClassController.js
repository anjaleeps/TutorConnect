const qs = require('querystring');
const url = require('url');
const moduleCtrl = require('../app/Modules/ModuleController.js');
const userCtrl = require('../app/Users/UserController.js');

exports.handleRequest = function (request, response) {
    var parse = url.parse(request.url, true);
    var pathname = parse.pathname;
    var dest = pathname.substr(pathname.indexOf('/', 1) + 1);
    if (request.method == 'GET') {
        var query = parse.query;
        switch (dest) {
            case 'Tutor/Requests':
                userCtrl.getClassRequests(request, response, query.tutorId);
                break;
            case 'Tutor/Freetime':
                userCtrl.getTutorFreetimes(request, response, query.tutorId);
                break;
            case 'Tutor/Request/Remove':
                userCtrl.removeRequest(request, response, query.tutorId, query.studentId);
                break;
            case 'Tutor/Modules':
                moduleCtrl.getTutorModules(request, response, query.tutorId);
                break;
            case 'Classes':
                moduleCtrl.sendClasses(request, response, query.userId);
                break;
            case 'Ended':
                moduleCtrl.getEndedClasses(request, response, query.userId);
                break;
            case 'Subjects':
                moduleCtrl.getAllSubjects(request, response);
                break;
            case 'Levels':
                moduleCtrl.getLevels(request, response);
                break;
        }
    }
    else if (request.method === 'POST') {
        let data = '';
        request.on('data', chunk => {
            data += chunk;
        });
        request.on('end', () => {
            let params = qs.parse(data);
            console.log(params);
            switch (dest) {
                case 'Start':
                    moduleCtrl.startClass(request, response, JSON.parse(params.newClass));
                    break;
                case 'End':
                    moduleCtrl.endClass(request, response, JSON.parse(params.endClass));
                    break;
                case 'Reschedule':
                    moduleCtrl.rescheduleClass(request, response, JSON.parse(params.reschedClass));
                    break;
                case 'Post/Comment':
                    userCtrl.postComment(request, response, params.tutorId, JSON.parse(params.newComment));
                    break;
                case 'Post/Rating':
                    userCtrl.addRating(request, response, params.tutorId, params.studentId, params.rating);
            }
        });
    }
}