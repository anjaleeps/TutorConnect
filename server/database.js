var mysql = require('mysql');
var url = require('url');

var con = mysql.createConnection({
    host: "127.0.0.1",
    database: "tutorconnect",
    user: "root",
    password: "Notwithstand123"
});

con.connect(function (err) {
    if (err) { console.log(err) }
    console.log("Connected!");
});

exports.searchTutors =function(requesturl,callback) {
    var homeTown = requestUrl.query.homeTown;
    var q = "SELECT tutor_id,firstname,lastname,picture,rating FROM tutors where area = ?";
    con.query(q,[homeTown], function (err, result) {
        if (err) { console.log(err) }
        console.log(result);
        callback(null,result);
    });
    
}


exports.getCalInfo = function (requestUrl, callback) {
    var q = "SELECT ct.start_time, ct.end_time, ct.class_day AS weekday, st.subject_name, lt.level_name,CONCAT(stu.firstname,' ',stu.lastname) as stu_name, CONCAT(ttr.firstname,' ',ttr.lastname) as ttr_name FROM classes AS ct Inner join modules as mt on mt.module_id = ct.module_id INNER JOIN subjects AS st On mt.subject_id = st.subject_id INNER JOIN levels AS lt ON mt.level_id = lt.level_id INNER JOIN students AS stu ON stu.student_id = ct.student_id Inner Join tutors as ttr on ttr.tutor_id = mt.tutor_id WHERE mt.tutor_id = ? or ct.student_id = ? ORDER BY ct.start_time ASC, ct.end_time ASC";
    var userId = requestUrl.query.userid;
    con.query(q, [userId, userId], function (err, result) {
        if (err) { console.log(err) }
        console.log(result);
        callback(null, result);
    });
}

exports.getFreeSlots = function (requestUrl, callback) {
    var q = "SELECT start_time, end_time, free_day AS weekday FROM free_slots WHERE tutor_id = ? ORDER BY start_time ASC, end_time ASC";
    var userId = requestUrl.query.userid;
    console.log(userId);
    con.query(q, [userId], function (err, result) {
        if (err) { console.log(err) }
        console.log(result);
        callback(null, result);
    });
}