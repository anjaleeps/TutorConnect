const db = require('../../../Database/Database.js');

'use strict'

exports.getFreeslots= function(id, callback){
    var query = "SELECT TIME_FORMAT(start_time, ?) AS start_time, TIME_FORMAT(end_time, ?) AS end_time, free_day AS weekday FROM free_slots WHERE tutor_id = ? ORDER BY start_time ASC, end_time ASC";
    db.query(query, ['%h:%i %p', '%h:%i %p', id], function (err, result) {
        callback(null, result);
    });
}

exports.addFreeslot = function(id, starttime, endtime, day, callback){
    var query = "INSERT INTO free_slots VALUES (?,STR_TO_DATE(?,?),STR_TO_DATE(?,?),?)";
    db.query(query, [id, starttime, '%h:%i %p', endtime, '%h:%i %p', day], function (err, result) {
        callback(err, result);
    });
}

exports.removeFreeslot= function(id,starttime, endtime, day, callback){
    var query = "DELETE FROM free_slots WHERE tutor_id =? AND start_time = STR_TO_DATE(?,?) AND end_time = STR_TO_DATE(?,?) AND free_day = ?";
    db.query(query, [id, starttime, '%h:%i %p', endtime, '%h:%i %p', day], function (err, result) {
        callback(err, result);
    });
}
