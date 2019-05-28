const dbManager = require('./TutorCalDBManager.js');
const TutorCalendar = require('./TutorCalendar.js');
const CalendarBuilder = require('../../CalendarBuilder.js');

'use strict'

let instance=null;

class TutorCalendarBuilder extends CalendarBuilder {
    constructor() {
        if (!instance){
            super();
            instance = this;
        }
        return instance;
    }

    build(req, res, id) {
        var calendar = new TutorCalendar(id);
        this.buildFreeslots(id, function (err, freeslots) {
            if (!err) {
                calendar.freeslots = freeslots;
                console.log(calendar);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.write(JSON.stringify(calendar));
                res.end();
                return;
            }

        });
    }

    buildForUser(req, res, id) {
        var calendar = new TutorCalendar(id);

        var self=this;
        this.buildFreeslots(id, function (err, freeslots) {
            if (!err) {
                calendar.freeslots = freeslots;
            }
            self.buildClasses(id, function (err, classes) {
                if (!err) {
                    calendar.classes = classes;
                }
                console.log(calendar);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.write(JSON.stringify(calendar));
                res.end();
                return;
            });
        });
    }

    buildFreeslots(id, callback) {
        var freeslots = [];
        dbManager.getFreeslots(id, function (err, results) {
            if (!err) {
                for (var i = 0; i < results.length; i++) {
                    var freeslot = {
                        id: id,
                        starttime: results[i].start_time,
                        endtime: results[i].end_time,
                        day: results[i].weekday
                    }
                    freeslots.push(freeslot);
                }
            }
            //console.log(freeslots);
            callback(err, freeslots);
        });
    }

    removeFreeslot(req, res, id, timeslot){
        console.log(timeslot);
        dbManager.removeFreeslot(id, timeslot.starttime, timeslot.endtime,timeslot.day,function(err, result){
            if (!err){
                res.statusCode=200;
                res.end();
            }
            res.statusCode=502;
            res.end();
        });
    }

    addFreeslot(req,res,id, timeslot){
        console.log(timeslot.starttime);
        dbManager.addFreeslot(id, timeslot.starttime, timeslot.endtime,timeslot.day,function(err, result){
            if (!err){
                res.statusCode=200;
                res.end();
            }
            res.statusCode=502;
            res.end();
        });
    }
}

module.exports = TutorCalendarBuilder;