const db = require('../Database/database.js');
var levels;

exports.getLevels = function (req, res, callback) {
    
    db.getLevels(function (err, results) {
        if (!err) {
            levels = results;
            console.log('reached3');
        }
        callback(err, results);
    });
}


exports.getSubjects = function (id, callback) {
    var query = 'SELECT st.* FROM modules AS mt INNER JOIN subjects AS st ON st.subject_id=mt.subject_id INNER JOIN levels as lt ON lt.level_id=mt.level_id WHERE lt.level_id=?';
    db.query(query, [id], function (err, results) {
        callback(err, results);
    });
}

exports.getRequests = function (req, res, id, callback) {
    var query = "SELECT student_id FROM requests WHERE tutor_id=?";
    db.query(query, [id], function (err, results) {
        if (err) {
            res.statusCode = 504;
            res.write(err);
            res.end();
        }
        callback(null, results);
    });
}

exports.startClass = function (req, res, newClass) {
    var tutorId = newClass.tutor.id;
    var stuId = newClass.student.id;
    var level = newClass.level;
    var subject = newClass.subject;
    var starttime = newClass.starttime;
    var endtime = newClass.endtime;
    var day = newClass.day;
    var module_id;

    var query = "DELETE FROM requests WHERE tutor_id=? AND student_id=?";
    db.query(query, [tutorId, stuId], function (err, result) {
        if (err) {
            console.log(err);
            res.statusCode = 504;
            res.end();
        }
        var q = "SELECT mt.module_id FROM modules AS mt INNER JOIN levels AS lt ON lt.level_id=mt.level_id INNER JOIN subjects as st ON st.subject_id= mt.subject_id WHERE mt.tutor_id=? AND st.subject_name=? AND lt.level_name=?";
        db.query(q, [tutorId, level, subject], function (err, result) {
            if (err) {
                console.log(err);
                res.statusCode = 504;
                res.end();
            }
            module_id = result[0];
            var fq = "INSERT INTO classes VALUES (?,?,?,?,?)";
            db.query(fq, [tutorId, stuId, starttime, endtime, day], function (err, result) {
                if (err) {
                    console.log(err);
                    res.statusCode = 504;
                    res.end();
                }
                res.statusCode = 201;
                res.end();
            });
        });
    });
}

exports.deleteRequest = function (req, res, studentId, tutorId) {
    var query = "DELETE FROM requests WHERE tutor_id=? AND student_id=?";
    db.query(query, [tutorId, studentId], function (err, results) {
        if (err) {
            console.log(err);
            res.statusCode = 504;
            res.end();
        }
        res.statusCode = 201;
        res.end();
    });
}