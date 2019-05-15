const TutorCalendar = require('./TutorCalendar.js');
const auth = require('../../../Authorization/routes.config.js');
const Builder = require('../../CalendarBuilder.js');
const dbManager = require('../TutorDbManager.js');
const FreeSlot = require('./FreeSlot.js');


TutorCalendarBuilder = {
    build: function (req, res, tutorId) {
        Builder.call(this, req, res, tutorId);
        var calendar = new TutorCalendar(tutorId);
        calendar.freeSlots = this.getFreeSlots(req, res, tutorId);
        calendar.classes = Builder.prototype.getClasses.call(this, req, res, tutorId);
        return calendar;
    },

    getFreeSlots: function (req, res, id) {
        var freeSlots;
        dbManager.getFreeSlots(req, res, id, function (err, results) {
            for (i = 0; i < results.length; i++) {
                var freeSlot = new FreeSlot(results[i].start_time, results[i].end_time, results[i].weekday);
                freeSlots.push(freeSlot);
            }
        });
        return freeSlots;
    }
    
}


module.exports = TutorCalendarBuilder;