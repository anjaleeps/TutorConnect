const db = require('../../Database/database');
var query;

exports.getStudent = function (req, res, id) {
    var result;
    query = 'SELECT * FROM students as st INNER JOIN users as ut ON ut.user_id=st.student_id WHERE st.student_id=?';
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
    return result;
}

exports.createStudent = function (req, res, id, email, pwd, firstname, lastname) {
    query = 'INSERT INTO students VALUES(?,?,?,?,?,null)';
    db.query(query, [id,email,pwd,firstname,lastname], function (err, result) {
        if (err) {
            res.setStatus(400);
            res.write(err);
            res.end();
        }
    });
}
