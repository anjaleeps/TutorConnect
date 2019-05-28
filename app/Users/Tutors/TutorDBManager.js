const db = require('../../Database/Database.js');

exports.getTutor = function (id, callback) {
    var query = 'SELECT * FROM tutors WHERE tutor_id=?';
    db.query(query, [id], function (err, result) {
        callback(err, result);
    });
}

exports.searchTutors = function (levelId, subjectId, area, callback) {
    console.log(levelId, subjectId);
    var query = 'SELECT tt.* FROM modules AS mt INNER JOIN tutors AS tt ON tt.tutor_id=mt.tutor_id WHERE mt.level_id=? AND mt.subject_id=? AND tt.area=? ORDER BY tt.rating';
    db.query(query, [levelId, subjectId, area], function (err, results) {
        console.log('check' + results);
        callback(err, results);
    });
}

exports.createTutor = function (id, firstname, lastname, area, contactNo, callback) {
    var query = 'INSERT INTO tutors (tutor_id, firstname, lastname,picture, rating, area, contactNum) VALUES(?,?,?,null,0.0,?,?)';
    db.query(query, [id, firstname, lastname, area, contactNo], function (err, result) {
        callback(err, result);
    });
}

exports.logTutor = function (id, callback) {
    var query = 'SELECT * FROM tutors WHERE tutor_id=?';
    db.query(query, [id], function (err, result) {
        callback(err, result);
    });
}

exports.getContactNo = function (tutorId, studentId, callback) {
    var query = "SELECT contactNum FROM tutors where tutor_id =?";
    db.query(query, [tutorId], function (err, result) {
        callback(err, result);

        query = "INSERT INTO requests VALUES(?,?)";
        db.query(query, [tutorId, studentId], function (err, result) {
        });
    });
}

exports.getClassRequests = function(id, callback){
    var query = 'SELECT st.* FROM requests AS rt INNER JOIN students AS st ON rt.student_id=st.student_id WHERE tutor_id=?';
    db.query(query,[id], function(err, results){
        callback(err, results);
    });
}

exports.removeRequest = function(tutorId, studentId, callback){
    var query = 'DELETE FROM requests WHERE tutor_id=? AND student_id=?';
    db.query(query, [tutorId, studentId], function(err, result){
        callback(err, result);
    });
}

exports.getAreas = function(callback){
    var query = 'SELECT DISTINCT area FROM tutors ORDER BY area';
    db.query(query, [], function(err, results){
        callback(err, results);
        console.log(results);
    });
}