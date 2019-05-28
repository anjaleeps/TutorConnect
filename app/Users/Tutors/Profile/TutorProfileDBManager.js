const db = require('../../../Database/Database.js');

exports.getAdditional = function (id, callback) {
    var query = 'SELECT description, rated, rating FROM tutors WHERE tutor_id=?';
    db.query(query, [id], function (err, results) {
        callback(err, results);
    });
}

exports.getQualifs = function (id, callback) {
    var query = 'SELECT id, qualification FROM qualifications WHERE tutor_id=?';
    db.query(query, [id], function (err, results) {
        callback(err, results);
    });
}

exports.getComments = function (id, callback) {
    var query = 'SELECT ct.tutor_id, ct.student_id, ct.comment_content, DATE_FORMAT(comment_time,"%d/%m/%Y") AS comment_time, \
    st.firstname, st.lastname FROM comments AS ct \
    INNER JOIN students AS st ON st.student_id=ct.student_id WHERE tutor_id=? \
    ORDER BY comment_time DESC';
    db.query(query, [id], function (err, results) {
        callback(err, results);
    });
}

exports.getModules = function (id, callback) {
    var query = 'SELECT mt.module_id, st.subject_name, lt.level_name FROM modules AS mt INNER JOIN subjects AS st ON st.subject_id=mt.subject_id INNER JOIN levels AS lt ON lt.level_id=mt.level_id WHERE mt.tutor_id=?';
    db.query(query, [id], function (err, results) {
        callback(err, results);
    });
}

exports.checkPermission = function (tutorId, studentId, callback) {
    var query = "SELECT tutor_id FROM class_records AS ct \
    INNER JOIN modules AS mt ON mt.module_id=ct.module_id \
    WHERE mt.tutor_id=? AND ct.student_id=?";
    db.query(query, [tutorId, studentId], function (err, result) {
        callback(err, result);
    });
}

exports.postComment = function (id, newComment, callback) {
    var studentId = newComment.studentId;
    var content = newComment.content;

    var query = 'INSERT INTO comments VALUES (?,?,?,curdate()) \
    ON DUPLICATE KEY UPDATE comment_content=?, comment_time=curdate();';
    db.query(query, [id, studentId, content, content], function (err, result) {
        callback(err, result);
    });
}

exports.addRating = function (tutorId, studentId, rating, callback) {
    var query = "SELECT rate FROM ratings WHERE tutor_id=? AND student_id=?";
    db.query(query, [tutorId, studentId], function (err, result) {
        if (!err) {
            var prevRate = 0;
            if (result.length == 1) {
                prevRate = result[0].rate;
            }


            var query = "SELECT rating, rated FROM tutors WHERE tutor_id=? FOR UPDATE";
            db.query(query, [tutorId], function (err, result) {
                if (!err && result.length == 1) {
                    var old_rating = result[0].rating;
                    var old_rated = result[0].rated;
                    if (prevRate == 0) {
                        var new_rating = (old_rating * old_rated + rating) / (old_rated + 1);
                        var new_rated = old_rated + 1;
                    } else {
                        var new_rating = (old_rating * old_rated + rating - prevRate) / (old_rated);
                        var new_rated = old_rated;
                    }

                    var query = "UPDATE tutors SET rating=?, rated=? WHERE tutor_id=?";
                    db.query(query, [new_rating, new_rated, tutorId], function (err, result) {
                        callback(err, result);

                        var query = "INSERT INTO ratings VALUES (?,?,?) ON DUPLICATE KEY UPDATE rate=?";
                        db.query(query, [tutorId, studentId, rating, rating], function (err, result) {

                        });
                    });
                }
                callback(err);
            });
            return;
        }
        callback(err);
    });

}

exports.addModule = function (data, callback) {
    var query = "INSERT INTO modules (level_id, subject_id, tutor_id) VALUES (?,?,?)";
    db.query(query, [data.level, data.subject, data.tutorId], function (err, result) {
        callback(err, result);
    });
}

exports.addQualif = function (data, callback) {
    var query = "INSERT INTO qualifications (tutor_id, qualification) VALUES (?,?)";
    db.query(query, [data.tutorId, data.newQualif], function (err, result) {
        callback(err, result);
    });
}

exports.addDesc = function (data, callback) {
    var query = "UPDATE tutors SET description=? WHERE tutor_id=?";
    db.query(query, [data.newDesc, data.tutorId], function (err, result) {
        callback(err, result);
    });
}

exports.addArea = function(data, callback){
    var query = "UPDATE tutors SET area=? WHERE tutor_id=?";
    db.query(query, [data.newArea, data.tutorId], function (err, result) {
        callback(err, result);
    });
}

exports.addName = function(data, callback){
    var query = "UPDATE tutors SET firstname=?, lastname=? WHERE tutor_id=?";
    db.query(query, [data.firstname, data.lastname, data.tutorId], function (err, result) {
        callback(err, result);
    });
}