const tutorCtrl = require('./Tutors/TutorController.js');
const studentCtrl = require('./Students/StudentController.js');
const auth = require('../Authorization/routes.config.js');
const dbManager = require('./UserDBManager.js');
const qs = require('querystring');
const UploadManager = require('./UploadManager.js');

var uploadManager = new UploadManager();

exports.getAreas =function(req, res){
    tutorCtrl.getAreas(req, res);
}

exports.getTutor= function(req, res, tutorId, callback){
    tutorCtrl.getTutor(tutorId, function(err, result){
        callback(err, result);
    });
}
exports.getStudent= function(req, res, studentId, callback){
    studentCtrl.getTutor(studentId, function(err, result){
        callback(err, result);
    });
}
exports.searchTutors = function (req, res, levelId, subjectId, area) {
    tutorCtrl.searchTutors(req, res, levelId, subjectId, area);
}

exports.getTutorProfile = function (req, res, tutorId) {
    tutorCtrl.getProfile(req, res, tutorId);
}

exports.getTutorCalendar = function (req, res, tutorId) {
    tutorCtrl.getCalendar(req, res, tutorId);
}

exports.getStudentCalendar=function(req, res,studentId){
    studentCtrl.getCalendar(req, res, studentId);
}

exports.updateTutorCalendar = function (req, res, tutorId, timeslot, action) {
    var tslot = JSON.parse(timeslot);
    tutorCtrl.updateCalendar(req, res, tutorId, tslot, action);
}

exports.getTutorContactNo = function (req, res, tutorId, studentId) {
    tutorCtrl.getContactNo(req, res, tutorId, studentId);
}

exports.editProfile = function(req, res, type, query){
    tutorCtrl.editProfile(req, res, type, query);
}

exports.signin = function (req, res, params) {
    //console.log(params);
    var form = qs.parse(params.form);
    console.log(form);
    if (params.type == 1) {
        studentCtrl.signin(req, res, form);
    }
    else if (params.type == 2) {
        tutorCtrl.signin(req, res, form);
    }
}

exports.login = function (req, res, params) {
    var form = qs.parse(params.form);
    console.log(form);
    var email = form.email;
    var password = form.password;

    dbManager.logUser(email, function (err, result) {
        console.log('reached');
        if (!err) {
            if (result.length == 1) {
                var id = result[0].user_id;
                var hash = result[0].pwd;
                var type = result[0].type_id;

                auth.verifyPassword(req, res, password, hash, function (err, result) {
                    if (!err) {
                        if (result == true) {
                            if (type == 1) {
                                studentCtrl.login(req, res, id);
                            }
                            else if (type == 2) {
                                tutorCtrl.login(req, res, id);
                            }
                        } else {
                            res.statusCode = 402;
                            res.write("Invalid Password");
                            res.end();
                        }
                        return;
                    }
                    console.log(err);
                    res.statusCode = 502;
                    res.end();
                });
                return;
            }
            res.statusCode = 402;
            res.write("Invalid email address");
            res.end();
        }
    });
}

exports.getClassRequests = function(req, res, tutorId){
    tutorCtrl.getClassRequests(req, res, tutorId);
}

exports.getTutorFreetimes=function(req, res, tutorId){
    tutorCtrl.getFreetimes(req, res, tutorId);
}

exports.removeRequest = function(req, res, tutorId, studentId){
    tutorCtrl.removeRequest(req, res, tutorId, studentId);
}

exports.postComment = function(req, res, tutorId, newComment){
    tutorCtrl.postComment(req, res, tutorId, newComment);
}

exports.addRating = function(req, res, tutorId, studentId, rating){
    tutorCtrl.addRating(req, res, tutorId, studentId, rating);
}

exports.verifyToken = function (req, res) {
    auth.verifyToken(req, res);
}

exports.isSameUser = function(req, res, id){
    var token = req.access_token;
    console.log(token.id, id);
    if (token !== undefined && auth.isSameUser(token.id, id)) {
        res.statusCode=201;
        res.end();
    }
    else{
        res.statusCode=403;
        res.end();
    }
}

exports.uploadPicture = function(req, res){
    uploadManager.uploadPicture(req, res);
}