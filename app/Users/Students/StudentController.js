const Student = require('./Student.js');
const dbManager = require('./StudentDBManager.js');
const userDBManager = require('../UserDBManager.js');
const auth = require('../../Authorization/routes.config.js');
const config = require('../../Authorization/Configs/env.config.js');
const CalendarBuilder = require('./Calendar/StudentCalendarBuilder');


const STUDENT = config.permissionLevels.STUDENT;

var calBuilder = new CalendarBuilder();

exports.getStudent = function (id, callback) {
    dbManager.getStudent(id, function (err, result) {
        if (!err) {
            var student = new Student(id, result[0].firstname, result[0].lastname, result[0].picture);
            callback(null, student);
        }
    });
}

exports.signin = function (req, res, form) {
    console.log('reached ');
    var email = form.email;
    var password = form.password;
    var firstname = form.firstname;
    var lastname = form.lastname;
    console.log(email);

    if (auth.validateEmail(req, res, email) && auth.validatePassword(req, res, password)) {

        auth.hashPassword(req, res, password, function (err, pwd) {
            if (!err) {

                userDBManager.createUser(email, pwd, 1, function (err, result) {
                    if (!err) {
                        var id = result.insertId;

                        dbManager.createStudent(id, firstname, lastname, function (err, result) {
                            if (!err) {
                                var student = new Student(id, firstname, lastname, null);
                                student.permissionLevel = STUDENT;
                                auth.createToken(req, res, student);
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
    dbManager.logStudent(id, function (err, result) {
        if (!err) {
            var student = new Student(id, result[0].firstname, result[0].lastname, result[0].picture);
            student.permissionLevel = STUDENT;
            auth.createToken(req, res, student);
            return;
        }
        res.statusCode = 502;
        res.end();
    });
}

exports.getCalendar = function (req, res, id) {
    var token = req.access_token;
    if (token !== undefined && auth.hasMinimumPermissionLevelRequired(STUDENT, token.permissionLevel) && auth.isSameUser(token.id, id)) {
        calBuilder.buildForUser(req, res, id);
    }
}