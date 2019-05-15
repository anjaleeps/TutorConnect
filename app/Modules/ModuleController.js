const Level = require('./Level.js');
const Class = require('./Class.js');
const dbManager = require('./ModuleDBManager.js');
const Module = require('./Module.js');
const Student = require('../Users/Students/Student.js');
const userConfig = require('../Authorization/Configs/env.config.js');
const auth = require('../Authorization/routes.config.js');

const TUTOR = userConfig.permissionLevels.TUTOR;

exports.getLevels = function (req, res) {
    var levels;

    dbManager.getLevels(req, res, function (err, results) {
        console.log(results);
        for (i = 0; i < results.length; i++) {
            new Level(results[i].level_id, results[i].level_name);
        }
    });

    levels = Level.levels;
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify(levels));
    res.end();
}

exports.getTutorModules = function (req, res, id) {
    var modules = [];
    dbManager.getTutorModules(req, res, id, function (err, results) {
        for (i = 0; i < results.length; i++) {
            modules.push(new Module(results[i].tutor_id, results[i].subject_name, results[i].level_name));
        }
    });
    return modules;
}

exports.getRequests = function (req, res, id) {
    var token = req.token;
    if (token !== null) {
        if (auth.hasMinimumPermissionLevelRequired(TUTOR, token.permissionLevel) && auth.isSameUser(token.id, id)) {
            var requests = [];
            dbManager.getRequests(req, res, id, function (err, results) {
                for (i = 0; i < results.length; i++) {
                    var student = Student.getStudentInstance(req, res, results[i].student_id);
                    requests.push(student);
                }
            });
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify(requests), replacer);
            res.end();
        }
    }
}

exports.deleteRequest = function (req, res, studentId, tutorId) {
    var token = req.token;
    if (token !== null) {
        if (auth.hasMinimumPermissionLevelRequired(TUTOR, token.permissionLevel) && auth.isSameUser(token.id, id)) {
            dbManager.deleteRequest(req, res, studentId, tutorId);
        }
    }
}

exports.startClass = function (req, res, newClass) {
    var c = JSON.parse(newClass);
    var newClz = new Class(c.tutor, c.student, c.level, c.subject, c.starttime, c.endtime, c.day);
    db.startClass(req, res, newClz);
}

function replacer(key, value) {
    if (key == 'pwd') { return 'undefined' }
    if (key == 'email') { return 'undefined' }
}

