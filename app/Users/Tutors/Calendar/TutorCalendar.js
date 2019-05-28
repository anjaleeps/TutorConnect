const Calendar = require('../../Calendar.js');

class TutorCalendar extends Calendar{
    constructor(id){
        super(id);
        this._freeslots=[];
    }

    get freeslots(){
        return this._freeslots;
    }

    set freeslots(freeslots){
        this._freeslots=freeslots;
    }

}

module.exports=TutorCalendar;