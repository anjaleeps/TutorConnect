const db = require('../../Database/database');

exports.getTutor = function (req, res, id) {
    var result;
    var query = 'SELECT * FROM tutors as st INNER JOIN users as ut ON ut.user_id=tt.tutor_id WHERE tt.tutor_id=?';
    db.query(query, [id], function (err, result) {
        if (err) {
            res.setStatus(400);
            res.write(err);
            res.end();
        }
        if (result.length > 0) {
            result = result[0];
        } else {
            res.setStatus(400);
            res.write(err);
            res.end();
        }
    });
}

exports.createTutor = function (id, email, pwd, firstname, lastname,area) {
    var query = 'INSERT INTO students VALUES(?,?,?,?,?,null,0.0,?)';
    db.query(query, [id, email, pwd, firstname, lastname,area], function (err, result) {
        if (err) {
            res.setStatus(400);
            res.write(err);
            res.end();
        }
    });
}

exports.searchTutors = function (req, res, level, subject, area) {
    var query = 'SELECT mt.tutor_id FROM modules AS mt INNER JOIN tutors AS tt ON tt.tutor_id=mt.tutor_id WHERE mt.level_id=? AND mt.subject_id=? AND tt.area=? ORDER BY tt.rating';
    db.query(query, [level, subject, area], function (err, results) {
        if (err) {
            console.log(err);
            res.statusCode(504);
            res.write(err);
            res.end(); 
        }
        callback(null, results);
    });
}

exports.getFreeSlots = function (req, res, id, callback) {
    var query = "SELECT TIME_FORMAT(start_time, ?) AS start_time, TIME_FORMAT(end_time, ?) AS end_time, free_day AS weekday FROM free_slots WHERE tutor_id = ? ORDER BY start_time ASC, end_time ASC";
    db.query(query, ['%h:%i %p', '%h:%i %p', id], function (err, result) {
        if (err) {
            console.log(err);
            res.statusCode(504);
            res.write(err);
            res.end(); 
        }
        callback(null, result);
    });
}

exports.getTutorContact = function (req, res, tutorId, studentId, callback) {
    var query = "SELECT contactNum FROM tutors where tutor_id =?";
    db.query(query, [tutorId], function (err, result) {
        if (err) {
            console.log(err);
            res.statusCode=403;
            res.write(err);
            res.end();
        }
        recordRequests(tutorId, studentId, function (err, result) {
            if (err) {
                console.log(err);
                res.statusCode = 403;
                res.write(err);
                res.end();
            }
        });
        callback(null, result);
    });

}

function recordRequest(tutorId, studentId, callback) {
    var query = "INSERT INTO requests VALUES(?,?)";
    db.query(query, [tutorId, studentId], function (err, result) {
        if (err) {
            throw err;
        }
        
    });
}

