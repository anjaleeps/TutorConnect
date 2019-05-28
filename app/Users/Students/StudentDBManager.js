const db = require('../../Database/Database.js');

exports.getStudent = function (id, callback) {
    var query = 'SELECT * FROM students WHERE student_id=?';
    db.query(query, [id], function (err, result) {
        callback(err, result);
    });
}

exports.createStudent = function (id, firstname, lastname, callback) {
    var query = 'INSERT INTO students (student_id, firstname, lastname,picture) VALUES(?,?,?,null)';
    db.query(query, [id, firstname, lastname], function (err, result) {
       callback(err, result);
    });
}

exports.logStudent = function(id, callback){
    var query = 'SELECT * FROM students WHERE student_id=?';
    db.query(query, [id], function (err, result) {
        callback(err, result);
     });
}
