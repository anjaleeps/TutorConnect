const user = require('./User.js');
const Student = require('./Students/Student.js');
const Tutor = require('./Tutors/Tutor.js');
const tutorProfCtrl = require('./Tutors/Profile/TutorProfileController.js');
const tutorCalCtrl = require('./Tutors/Calendar/TutorCalendarController.js');
const auth = require('../Authorization/routes.config.js')
//const tutordb = require('./Tutors/TutorDbManager.js');

exports.signin = function (req, res, data) {
    if (data.type === 1) {
        Student.studentSignin(req, res, data);
    } else if (data.type == 2) {
        Tutor.tutorSignin(data);
    }
}

exports.login = function (req, res, data) {
    var user = user.getUser(data);
    if (user.type === 1) {
        Student.studentLogin(req, res, user.id);
    } else if (user.type == 2) {
        Tutor.tutorLogin(user.id);
    }
}

exports.verifyToken = function (req, res) {
    auth.verifyUser(req, res);
}

exports.searchTutors = function (req, res, level, name, area) {
    Tutor.searchTutors(req, res, level, name, area);
}

exports.getTutorProfile = function (req, res, tutorId) {
    tutorProfCtrl.getProfile(req,res,tutorId);
}

exports.getTutorCalendar = function (req, res, tutorId) {

}

exports.getTutorInstance = function (req, res, id) {
    return Tutor.getTutorInstance(req,res, id);
}

exports.getStudentInstance = function (req, res, id) {
    return Student.getStudentInstance(req, res, id);
}

exports.getUserInstance = function (req, res, id) {
    return Student.getTutorInstance(req, res, id);
}

exports.getUserCalendar = function (req, res, id, type) {
    if (type == 1) {

    }
    else if (type == 2) {
        tutorCalCtrl.getCalendar(req, res, id);
    }
}

exports.getFreeSlots = function (req, res, id) {
    tutorCalCtrl.getFreeSlots(req, res, id);
}

exports.updateTutorCalendar = function (req, res, params) {
    tutorCalCtrl.updateCalendar(req, res, params);
}

exports.getTutorContact = function (req, res, tutorId, studentId) {
    Tutor.getContact(req, res,tutorId, studentId);
}