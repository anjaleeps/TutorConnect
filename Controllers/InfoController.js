const qs = require('querystring');
const url = require('url');
const userCtrl = require('../app/Users/UserController.js');
const moduleCtrl = require('../app/Modules/ModuleController.js')

exports.handleRequest = function (request, response) {
    var parse = url.parse(request.url, true);  
    var pathname = parse.pathname;
    var dest = pathname.substr(pathname.indexOf('/', 1) + 1);
    if (request.method == 'GET') {
        var query = parse.query;
        switch (dest) {
            case 'Tutors/Search':
                userCtrl.searchTutors(request, response, query.level, query.subject, query.area);
                break;
            case 'Levels':
                moduleCtrl.getLevels(request,response);
                break;
            case 'Tutor/Profile':
                userCtrl.getTutorProfile(request, response, query.tutorId);
                break;
            case 'User/Calendar':
                userCtrl.getUserCalendar(request, response, query.userId, query.type);
                break;
            case 'Tutor/Contact':
                userCtrl.getContactInfo(request, response, query.tutorId, query.studentId);
                break;
            case 'Add/Module':
                userCtrl.editProfile(request, response, "module", query);
                break;
            case 'Add/Qualif':
                userCtrl.editProfile(request, reposponse, "qualif", query);
                break;
            case 'Change/Desc':
                userCtrl.editProfile(request, response, "desc", query);
                break;
        }
    }
}

