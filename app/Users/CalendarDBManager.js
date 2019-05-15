const db = require('../Database/database.js');

exports.getClasses = function (req, res, id, callback) {
    var query = "SELECT TIME_FORMAT(ct.start_time, ?) AS start_time, TIME_FORMAT(ct.end_time, ?) AS end_time, ct.class_day AS weekday, st.subject_name, lt.level_name, ct.student_id as stu_id, mt.tutor_id as ttr_id FROM classes AS ct Inner join modules as mt on mt.module_id = ct.module_id INNER JOIN subjects AS st On mt.subject_id = st.subject_id INNER JOIN levels AS lt ON mt.level_id = lt.level_id INNER JOIN students AS stu ON stu.student_id = ct.student_id WHERE mt.tutor_id = ? or ct.student_id = ? ORDER BY ct.start_time ASC, ct.end_time ASC";
    db.query(query, ['%h:%i %p', '%h:%i %p', id, id], function (err, result) {
        if (err) {
            console.log(err);
            res.tatusCode(400);
            res.write(err);
            res.end();
        }

        callback(null, result);
    });
}

exports.removeFreeSlot = function (req, res, newFreeSlot, id) {
    var freeSlot = JSON.parse(newFreeSlot);
    var from = freeSlot.starttime;
    var to = freeSlot.endtime;
    var day = freeSlot.day;

    var query = "DELETE FROM free_slots WHERE tutor_id =? AND start_time = STR_TO_DATE(?,?) AND end_time = STR_TO_DATE(?,?) AND free_day = ?";
    db.query(query, [id, from, '%h:%i %p', to, '%h:%i %p', day], function (err, result) {
        if (err) {
            console.log(err);
            res.statusCode = 504;
            res.write(err);
            res.end();
        }
        res.statusCode = 201;
        res.end();
    });
}

exports.addFreeSlot = function (data) {
    var freeSlot = JSON.parse(newFreeSlot);
    var from = freeSlot.starttime;
    var to = freeSlot.endtime;
    var day = freeSlot.day;

    var query = "INSERT INTO free_slots VALUES (?,STR_TO_DATE(?,?),STR_TO_DATE(?,?),?)";
    con.query(inp, [id, from, '%h:%i %p', to, '%h:%i %p', day], function (err, result) {
        if (err) {
            console.log(err);
            res.statusCode = 504;
            res.write(err);
            res.end();
        }
        res.statusCode = 201;
        res.end();
    });

}

