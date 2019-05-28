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
            case 'Levels':
                moduleCtrl.getLevels(request, response);
                break;
            case 'Subjects':
                moduleCtrl.getSubjects(request, response, query.levelId);
                break;
            case 'Areas':
                userCtrl.getAreas(request, response);
                break;
            case 'Tutors/Search':
                userCtrl.searchTutors(request, response, query.levelId, query.subjectId, query.area);
                break;
            case 'Tutor/Profile':
                userCtrl.getTutorProfile(request, response, query.tutorId);
                break;
            case 'User/Calendar':
                if (query.type == 2) {
                    userCtrl.getTutorCalendar(request, response, query.userId);
                } else if (query.type == 1) {
                    userCtrl.getStudentCalendar(request, response, query.userId);
                }
                break;
            case 'Tutor/Contact':
                userCtrl.getTutorContactNo(request, response, query.tutorId, query.studentId);
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
            console.log(data);
            for(key in params) {
                //console.log(key);
            }
            //console.log(params['name']);
            //console.log(params);

            switch (dest) {
                case 'Calendar/Tutor/Update':
                    userCtrl.updateTutorCalendar(request, response, params.userId, params.timeslot, params.action);
                    break;
                case 'Profile/Edit':
                    userCtrl.editProfile(request, response, params.type, params);
                    break;
                case 'Upload/Picture':
                    request.post=data;
                    userCtrl.uploadPicture(request, response);
            }
        });
    }

}