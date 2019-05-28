const Tutor = require('./Tutor.js');
const dbManager = require('./TutorDBManager.js');
const TutorProfileBuilder = require('./Profile/TutorProfileBuilder.js');
const userDBManager = require('../UserDBManager.js');
const auth = require('../../Authorization/routes.config.js');
const config = require('../../Authorization/Configs/env.config.js');
const CalendarBuilder = require('./Calendar/TutorCalendarBuilder');
const ProfileFunctions = require('./Profile/ProfileFunctions.js');

const TUTOR = config.permissionLevels.TUTOR;
const STUDENT = config.permissionLevels.STUDENT;
var calBuilder = new CalendarBuilder();
var profileBuilder = new TutorProfileBuilder();
var profileFunctions = new ProfileFunctions();

'use strict'

exports.getAreas = function(req, res){
    dbManager.getAreas(function(err, results){
        if (!err){
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify(results));
            res.end();
            return;
        }
        res.statusCode = 502;
        res.end();
    });
}

exports.getTutor = function(id, callback){
    dbManager.getTutor(id, function(err, results){
        if (!err){
            var tutor = new Tutor(results[i].tutor_id, results[i].firstname, results[i].lastname, results[i].rating, results[i].area, results[i].picture);
            callback(null, tutor);
            return;
        }
        callback(err);
    });
}

exports.searchTutors = function (req, res, levelId, subjectId, area) {
    tutors = [];
    dbManager.searchTutors(levelId, subjectId, area, function (err, results) {
        if (!err) {
            for (i = 0; i < results.length; i++) {
                var tutor = new Tutor(results[i].tutor_id, results[i].firstname, results[i].lastname, results[i].rating, results[i].area, results[i].picture);
                console.log("tutor" + tutor);
                tutors.push(tutor);
            }
            console.log(tutors);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify(tutors));
            res.end();
            return;
        }
        res.statusCode = 502;
        res.end();
    });
}

exports.getProfile = function (req, res, id) {
    profileBuilder.build(req, res, id);
}

exports.getCalendar = function (req, res, id) {
    var token = req.access_token;
    if (token !== undefined && auth.hasMinimumPermissionLevelRequired(TUTOR, token.permissionLevel) && auth.isSameUser(token.id, id)) {
        calBuilder.buildForUser(req, res, id);
    }
    else {
        calBuilder.build(req, res, id);
    }
}

exports.updateCalendar = function (req, res, id, timeslot, action) {
    var token = req.access_token;
    if (token !== undefined && auth.hasMinimumPermissionLevelRequired(TUTOR, token.permissionLevel) && auth.isSameUser(token.id, id)) {
        if (action == 'remove') {
            calBuilder.removeFreeslot(req, res, id, timeslot);
        } else if (action = 'add') {
            calBuilder.addFreeslot(req, res, id, timeslot);
        }
    }
}

exports.signin = function (req, res, form) {
    var email = form.email;
    var password = form.password;
    var firstname = form.firstname;
    var lastname = form.lastname;
    var area = form.area;
    var contactNo = form.contactNo;

    if (auth.validateEmail(req, res, email) && auth.validatePassword(req, res, password)) {
        console.log('reached ');

        auth.hashPassword(req, res, password, function (err, pwd) {
            if (!err) {

                userDBManager.createUser(email, pwd, 2, function (err, result) {
                    if (!err) {
                        var id = result.insertId;

                        dbManager.createTutor(id, firstname, lastname, area, contactNo, function (err, result) {
                            if (!err) {
                                var tutor = new Tutor(id, firstname, lastname, 0.0, area, null);
                                tutor.permissionLevel = TUTOR;
                                auth.createToken(req, res, tutor);
                                return;
                            }
                            res.statusCode = 502;
                            res.end();
                        });

                        return;
                    }
                    res.statusCode = 502;
                    res.end();
                });
            }
        });
    }
}

exports.login = function (req, res, id) {
    console.log('reached here');
    dbManager.logTutor(id, function (err, result) {
        if (!err) {
            var tutor = new Tutor(id, result[0].firstname, result[0].lastname, result[0].rating, result[0].area, result[0].picture);
            tutor.permissionLevel = TUTOR;
            auth.createToken(req, res, tutor);
            return;
        }
        res.statusCode = 502;
        res.end();
    });
}

exports.getContactNo = function (req, res, tutorId, studentId) {
    var token = req.access_token;
    if (token !== undefined && auth.hasMinimumPermissionLevelRequired(STUDENT, token.permissionLevel)) {
        dbManager.getContactNo(tutorId, studentId, function (err, result) {
            if (!err) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.write(JSON.stringify(result[0]));
                res.end();
                return;
            }
            res.statusCode = 501;
            res.end();
        });
        return;
    }
    else {
        res.statusCode = 403;
        res.end();
    }
}

exports.getClassRequests = function (req, res, id) {
    var token = req.access_token;
    if ((token !== undefined) && auth.hasMinimumPermissionLevelRequired(TUTOR, token.permissionLevel) && auth.isSameUser(token.id, id)) {
        var requests = [];
        dbManager.getClassRequests(id, function (err, results) {
            if (!err) {
                for (var i = 0; i < results.length; i++) {
                    var request = {
                        id: results[i].student_id,
                        name: results[i].firstname + " " + results[i].lastname,
                        picture: results[i].picture
                    }
                    requests.push(request);
                }
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.write(JSON.stringify(requests));
                res.end();
                return;
            }
            res.statusCode = 502;
            res.end();
        });
    }
    else {
        res.statusCode = 403;
        res.end();
    }
}

exports.getFreetimes = function (req, res, id) {
    calBuilder.buildFreeslots(id, function (err, freeslots) {
        if (!err) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify(freeslots));
            res.end();
            return;
        }
    });
}

exports.removeRequest = function (req, res, tutorId, studentId) {
    console.log(tutorId);
    var token = req.access_token;
    if ((token !== undefined) && auth.hasMinimumPermissionLevelRequired(TUTOR, token.permissionLevel) && auth.isSameUser(token.id, tutorId)) {
        dbManager.removeRequest(tutorId, studentId, function (err, result) {
            if (!err) {
                res.statusCode = 200;
                res.end();
            }
            res.statusCode = 501;
            res.end();
        });
    }else{
        res.statusCode=403;
        res.end();
    }
}

exports.postComment= function(req, res, id, newComment){
    var token = req.access_token;
    if ((token !== undefined) && auth.hasMinimumPermissionLevelRequired(STUDENT, token.permissionLevel) && !auth.isSameUser(token.id, id)) {
        profileBuilder.postComment(req, res, id, newComment);
    }
}

exports.addRating = function(req, res, tutorId, studentId, rating){
    var token = req.access_token;
    if ((token !== undefined) && auth.hasMinimumPermissionLevelRequired(STUDENT, token.permissionLevel) && !auth.isSameUser(token.id, tutorId)) {
        profileBuilder.addRating(req, res, tutorId, studentId, rating);
    }
}

exports.editProfile = function(req, res, type, query){
    var token = req.access_token;
    if ((token !== undefined) && auth.hasMinimumPermissionLevelRequired(TUTOR, token.permissionLevel) && auth.isSameUser(token.id, query.tutorId)) {
        profileFunctions.editProfile(req, res, type, query);
    }
}