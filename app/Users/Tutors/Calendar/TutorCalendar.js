'use strict'

const Calendar = require('../../Calendar.js');
const dbManager = require('../TutorDBManager.js');

class TutorCalendar extends Calendar{

    constructor(tutorId) {
        super(tutorId);
        this.freeSlots = [];
    }

    set freeSlots(freeSlots) {
        this.freeSlots = freeSlots;
    }
}

module.export = TutorCalendar;