const db = require('../../../Database/database');
var query;

exports.getQualifs = function (id, callback) {
    query = 'SELECT qualification FROM qualifications WHERE tutor_id=?';
    db.query(query, [id], function (err, results) {
        if (err) {
            console.log(err);
            res.statusCode(504);
            res.write(err);
            res.end();
        }
        callback(null, results);
    });
}

exports.getDesc = function (id, callback) {
    query = 'SELECT description FROM tutors WHERE tutor_id=?';
    db.query(query, [id], function (err, results) {
        if (err) {
            console.log(err);
            res.statusCode(504);
            res.write(err);
            res.end();
        }
        callback(null, results);
    });
}