const StudentCalendar = require('./StudentCalendar.js');
const CalendarBuilder = require('../../CalendarBuilder.js');

'use strict'

let instance= null;

class StudentCalendarBuilder extends CalendarBuilder {
    constructor() {
        if (!instance){
            super();
            instance=this;
        }
        return instance;
    }


    buildForUser(req, res, id) {
        var calendar = new StudentCalendar(id);

        this.buildClasses(id, function (err, classes) {
            if (!err) {
                calendar.classes = classes;
            }
            console.log(calendar);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify(calendar));
            res.end();
            return;
        });

    }


}

module.exports = StudentCalendarBuilder;