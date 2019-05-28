const db = require('../Database/database.js');

exports.getLevels = function (callback) {
    console.log('reached1');

    var query = 'SELECT * FROM levels';
    db.query(query, null, function (err, results) {
        callback(err, results);

    });
}

exports.getAllSubjects = function(callback){
    var query = "SELECT * FROM subjects";
    db.query(query, function(err, results){
        callback(err, results);
    });
}

exports.getSubjects = function (levelId, callback) {
    //console.log('reached1');
    var query = 'SELECT st.* FROM modules AS mt INNER JOIN subjects AS st ON st.subject_id=mt.subject_id INNER JOIN levels as lt ON lt.level_id=mt.level_id WHERE lt.level_id=?';
    db.query(query, [levelId], function (err, results) {
        callback(err, results);
    });
}

exports.getClasses = function (id, callback) {
    var query = "SELECT TIME_FORMAT(ct.start_time, ?) AS start_time,TIME_FORMAT(ct.end_time, ?) AS end_time, \
    ct.class_day AS weekday, st.subject_name, lt.level_name, ct.student_id as stu_id, mt.tutor_id as ttr_id, \
    CONCAT(tt.firstname, ' ', tt.lastname) AS ttr_name, CONCAT(stu.firstname, ' ', stu.lastname) AS stu_name\
    FROM classes AS ct \
    Inner join modules as mt on mt.module_id = ct.module_id \
    INNER JOIN subjects AS st On mt.subject_id = st.subject_id \
    INNER JOIN levels AS lt ON mt.level_id = lt.level_id \
    INNER JOIN students AS stu ON stu.student_id=ct.student_id \
    INNER jOIN tutors AS tt ON tt.tutor_id=mt.tutor_id \
    WHERE mt.tutor_id = ? or ct.student_id = ? \
    ORDER BY ct.start_time ASC, ct.end_time ASC";
    db.query(query, ['%h:%i %p', '%h:%i %p', id, id], function (err, result) {
        callback(null, result);
    });
}

exports.getTutorModules = function (tutorId, callback) {
    var query = "SELECT st.subject_name, lt.level_name FROM modules AS mt INNER JOIN subjects AS st ON st.subject_id=mt.subject_id INNER JOIN levels AS lt ON lt.level_id=mt.level_id WHERE mt.tutor_id=?";
    db.query(query, [tutorId], function (err, results) {
        callback(err, results);
    });
}

exports.startClass = function (newClass, callback) {
    var tutorId = newClass.tutor;
    var studentId = newClass.student;
    var level = newClass.level;
    var subject = newClass.subject;
    var starttime = newClass.starttime;
    var endtime = newClass.endtime;
    var day = newClass.day;

    var query = 'DELETE FROM requests WHERE tutor_id=? AND student_id=?';
    db.query(query, [tutorId, studentId], function (err, result) {
        if (!err && result.affectedRows == 1) {

            var query = "DELETE FROM free_slots WHERE tutor_id =? AND start_time = STR_TO_DATE(?,?) AND end_time = STR_TO_DATE(?,?) AND free_day = ?";
            db.query(query, [tutorId, starttime, '%h:%i %p', endtime, '%h:%i %p', day], function (err, result) {
                if (!err && result.affectedRows == 1) {

                    var query = 'SELECT mt.module_id FROM modules AS mt INNER JOIN levels AS lt ON lt.level_id=mt.level_id INNER JOIN subjects AS st ON st.subject_id=mt.subject_id WHERE lt.level_name=? AND st.subject_name=? AND mt.tutor_id=?';
                    db.query(query, [level, subject, tutorId], function (err, result) {
                        if (!err) {

                            var moduleId = result[0].module_id;
                            var query = 'INSERT INTO classes VALUES (?,?, STR_TO_DATE(?,?),STR_TO_DATE(?,?),?)';
                            db.query(query, [moduleId, studentId, starttime, '%h:%i %p', endtime, '%h:%i %p', day], function (err, result) {
                                callback(err, result);
                                var query = "INSERT INTO class_records(module_id, student_id, start_date) VALUES (?,?,curdate())";
                                db.query(query, [moduleId, studentId], function (err, result) { });
                            });
                        }
                    });
                }

            });

        }
    });
}

exports.endClass = function (endClz, callback) {
    var tutorId = endClz.tutorId;
    var studentId = endClz.studentId;
    var level = endClz.level;
    var subject = endClz.subject;

    var query = 'SELECT mt.module_id FROM modules AS mt \
    INNER JOIN levels AS lt ON lt.level_id=mt.level_id \
    INNER JOIN subjects AS st ON st.subject_id=mt.subject_id \
    WHERE lt.level_name=? AND st.subject_name=? AND mt.tutor_id=?';
    db.query(query, [level, subject, tutorId], function (err, result) {
        if (!err) {

            var moduleId = result[0].module_id;
            var query = "DELETE FROM classes WHERE module_id=? AND student_id=?";
            db.query(query, [moduleId, studentId], function (err, result) {
                callback(err, result);

                var query = "UPDATE class_records SET end_date=curdate(), recently_ended=1 WHERE module_id=? AND student_id=?";
                db.query(query, [moduleId, studentId], function (err, result) {});

            });
            return;
        }
        callback(err);
    });
}

exports.rescheduleClass = function (reschedClz, callback) {
    var tutorId = reschedClz.tutorId;
    var studentId = reschedClz.studentId;
    var level = reschedClz.level;
    var subject = reschedClz.subject;
    var starttime = reschedClz.starttime;
    var endtime = reschedClz.endtime;
    var day = reschedClz.day;

    var query = "DELETE FROM free_slots WHERE tutor_id =? AND start_time = STR_TO_DATE(?,?) AND end_time = STR_TO_DATE(?,?) AND free_day = ?";
    db.query(query, [tutorId, starttime, '%h:%i %p', endtime, '%h:%i %p', day], function (err, result) {

        if (!err && result.affectedRows == 1) {
            var query = 'SELECT mt.module_id FROM modules AS mt \
            INNER JOIN levels AS lt ON lt.level_id=mt.level_id \
            INNER JOIN subjects AS st ON st.subject_id=mt.subject_id \
            WHERE lt.level_name=? AND st.subject_name=? AND mt.tutor_id=?';
            db.query(query, [level, subject, tutorId], function (err, result) {
                if (!err) {

                    var moduleId = result[0].module_id;
                    var query = "UPDATE classes SET start_time=STR_TO_DATE(?,?), end_time=STR_TO_DATE(?,?), class_day=? \
                    WHERE module_id=? AND student_id=?";
                    db.query(query, [starttime, '%h:%i %p', endtime, '%h:%i %p', day, moduleId, studentId], function (err, result) {
                        callback(err, result);
                    });
                    return;
                }
                callback(err);
            });
        }
    });
}

exports.getEndedClasses = function(studentId, callback){
    var query =  "SELECT crt.id, mt.tutor_id, CONCAT(tt.firstname,' ', tt.lastname) AS tutor_name, lt.level_name, st.subject_name \
    FROM class_records AS crt \
    INNER JOIN modules AS mt ON mt.module_id=crt.module_id \
    INNER JOIN subjects AS st ON st.subject_id=mt.subject_id \
    INNER JOIN levels AS lt ON lt.level_id=mt.level_id \
    INNER JOIN tutors AS tt ON tt.tutor_id=mt.tutor_id \
    WHERE crt.student_id=? AND crt.recently_ended=1";
    db.query(query, [studentId], function(err, results){
        if (!err){
            callback(null, results);
            var query= "UPDATE class_records SET recently_ended=0 WHERE id=?";
            for (var i=0; i<results.length; i++){
                db.query(query, [results[i].id], function(err, result){});
            }
            return;
        }
        callback(err);
    });
}

