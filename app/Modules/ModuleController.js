const dbManager = require('./ModuleDBManager.js');
const auth = require('../Authorization/routes.config.js');
const config = require('../Authorization/Configs/env.config.js');
const userCtrl = require('../Users/UserController.js');

const TUTOR = config.permissionLevels.TUTOR;
const STUDENT = config.permissionLevels.STUDENT;
const USER = config.permissionLevels.USER;

exports.getLevels = function (req, res) {
    var levels = [];
    dbManager.getLevels(function (err, results) {
        if (!err) {
            for (i = 0; i < results.length; i++) {
                var level = {
                    id: results[i].level_id,
                    name: results[i].level_name,
                }
                levels.push(level);
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify(levels));
            res.end();
            return;
        }
        res.statusCode = 502;
        res.end();
        //console.log('reached2');
    });
    console.log('reached');
}

exports.getSubjects = function (req, res, levelId) {
    var subs = {};
    dbManager.getSubjects(levelId, function (err, subjects) {
        if (!err) {
            for (j = 0; j < subjects.length; j++) {
                var subject = {
                    id: subjects[j].subject_id,
                    name: subjects[j].subject_name
                }
                subs[subject.name] = subject;
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify(subs));
            res.end();
            return;
        }
        res.statusCode = 502;
        res.end();
    });
}

exports.getTutorModules = function (req, res, tutorId) {
    console.log('rea');
    var modules = {};
    dbManager.getTutorModules(tutorId, function (err, results) {
        if (!err) {
            for (var i = 0; i < results.length; i++) {
                if (!(results[i].level_name in modules)) {
                    modules[results[i].level_name] = [];
                }
                modules[results[i].level_name].push(results[i].subject_name);
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify(modules));
            res.end();
            return;
        }
        res.statusCode = 502;
        res.end();
    });
}

exports.getClasses = function (id, callback) {
    var classes = [];
    dbManager.getClasses(id, function (err, results) {
        if (!err) {
            
            for (i = 0; i < results.length; i++) {
                var clz = {
                    tutorId: results[i].ttr_id,
                    tutorName: results[i].ttr_name,
                    studentId: results[i].stu_id,
                    studentName: results[i].stu_name,
                    starttime: results[i].start_time,
                    endtime: results[i].end_time,
                    day: results[i].weekday,
                    subject: results[i].subject_name,
                    level: results[i].level_name
                }

                classes.push(clz);
            }
        }
        callback(err, classes);
    });
}

exports.startClass = function (req, res, newClass) {
    var token = req.access_token;
    if (token !== undefined && auth.hasMinimumPermissionLevelRequired(TUTOR, token.permissionLevel) && auth.isSameUser(token.id, newClass.tutor)) {
        dbManager.startClass(newClass, function (err, result) {
            if (!err && result.affectedRows == 1) {
                res.statusCode = 200;
                res.end();
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


exports.sendClasses = function (req, res, userId) {
    var token = req.access_token;
    if (token !== undefined && auth.hasMinimumPermissionLevelRequired(USER, token.permissionLevel) && auth.isSameUser(token.id, userId)) {
        exports.getClasses(userId, function (err, classes) {
            if (!err) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.write(JSON.stringify(classes));
                res.end();
                return;
            }
            res.statusCode = 502;
            res.end();
        });
    } else {
        res.statusCode = 403;
        res.end();
    }
}

exports.endClass = function (req, res, endClz) {
    var token = req.access_token;
    if (token !== undefined && auth.hasMinimumPermissionLevelRequired(TUTOR, token.permissionLevel) && auth.isSameUser(token.id, endClz.tutorId)) {
        dbManager.endClass(endClz, function (err, result) {
            if (!err && result.affectedRows == 1) {
                res.statusCode = 200;
                res.end();
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

exports.rescheduleClass = function (req, res, reschedClz) {
    var token = req.access_token;
    if (token !== undefined && auth.hasMinimumPermissionLevelRequired(TUTOR, token.permissionLevel) && auth.isSameUser(token.id, reschedClz.tutorId)) {
        dbManager.rescheduleClass(reschedClz, function (err, result) {
            if (!err && result.affectedRows == 1) {
                res.statusCode = 200;
                res.end();
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

exports.getEndedClasses = function(req, res, studentId){
    var token = req.access_token;
    if (token !== undefined && auth.hasMinimumPermissionLevelRequired(STUDENT, token.permissionLevel) && auth.isSameUser(token.id, studentId)) {
        var classes=[];
        dbManager.getEndedClasses(studentId, function(err, results){
            if (!err){
                for (var i=0; i< results.length; i++){
                    var endedClass={
                        tutorId: results[i].tutor_id,
                        tutorName: results[i].tutor_name,
                        subject: results[i].subject_name,
                        level: results[i].level_name
                    }
                    classes.push(endedClass);
                }
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.write(JSON.stringify(classes));
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

exports.getAllSubjects = function(req, res){
    console.log("here");
    var subs=[];
    dbManager.getAllSubjects(function(err, subjects){
        if (!err) {
            for (j = 0; j < subjects.length; j++) {
                var subject = {
                    id: subjects[j].subject_id,
                    name: subjects[j].subject_name
                }
                subs.push(subject);
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify(subs));
            res.end();
            return;
        }
        res.statusCode = 502;
        res.end();
    });
}