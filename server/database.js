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

exports.searchTutors =function(requestUrl,callback) {
    var homeTown = requestUrl.query.homeTown;
    var q = "SELECT tutor_id,firstname,lastname,picture,rating FROM tutors where area = ?";
    con.query(q,[homeTown], function (err, result) {
        if (err) { console.log(err) }
        console.log(result);
        callback(null,result);
    });
    
}


exports.getCalInfo = function (requestUrl, callback) {
    var q = "SELECT TIME_FORMAT(ct.start_time, ?) AS start_time, TIME_FORMAT(ct.end_time, ?) AS end_time, ct.class_day AS weekday, st.subject_name, lt.level_name,CONCAT(stu.firstname,' ',stu.lastname) as stu_name, CONCAT(ttr.firstname,' ',ttr.lastname) as ttr_name FROM classes AS ct Inner join modules as mt on mt.module_id = ct.module_id INNER JOIN subjects AS st On mt.subject_id = st.subject_id INNER JOIN levels AS lt ON mt.level_id = lt.level_id INNER JOIN students AS stu ON stu.student_id = ct.student_id INNER JOIN tutors as ttr on ttr.tutor_id = mt.tutor_id WHERE mt.tutor_id = ? or ct.student_id = ? ORDER BY ct.start_time ASC, ct.end_time ASC";
    var userId = requestUrl.query.userid;
    con.query(q, ['%h:%i %p', '%h:%i %p',userId, userId], function (err, result) {
        if (err) { console.log(err) }
        console.log(result);
        callback(null, result);
    });
}

exports.getFreeSlots = function (requestUrl, callback) {
    var q = "SELECT TIME_FORMAT(start_time, ?) AS start_time, TIME_FORMAT(end_time, ?) AS end_time, free_day AS weekday FROM free_slots WHERE tutor_id = ? ORDER BY start_time ASC, end_time ASC";
    var userId = requestUrl.query.userid;
    console.log(userId);
    con.query(q, ['%h:%i %p', '%h:%i %p',userId], function (err, result) {
        if (err) { console.log(err) }
        console.log(result);
        callback(null, result);
    });
}

exports.removeTimeslot = function (data, callback) {
    let timeslot = data.timeslot.split(" ");
    let userid = data.userid;
    let day = timeslot[0];
    let start = timeslot.slice(1,3).join(" ");
    let end = timeslot.slice(4).join(" ");
    let q = "DELETE FROM free_slots WHERE tutor_id =? AND start_time = STR_TO_DATE(?,?) AND end_time = STR_TO_DATE(?,?) AND free_day = ?";
    con.query(q, [userid, start,'%h:%i %p',end,'%h:%i %p',day], function (err, result) {
        if (err) { callback(err,null) }
        callback(null, "success");
    });
}

exports.addTimeslot = function (data, callback) {
    let start = data.start + ':00';
    let end = data.end + '00';
    let day = data.day;
    let userid = data.userid;
    let classQuery = "SELECT ct.module_id FROM classes AS ct INNER JOIN modules AS mt ON ct.module_id=mt.module_id WHERE mt.tutor_id = ? AND ((? BETWEEN ct.start_time AND ct.end_time) OR (? BETWEEN ct.start_time AND ct.end_time))";
    con.query(q, [userid, start, end, '%h:%i %p', day], function (err, result) {
        if (err) {console.log(err)}
        
    });
}