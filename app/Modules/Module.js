'use strict'

class Module {
    constructor(tutorId, levelname, subjectname ) {
        this.tutorId = tutorId;
        this.subject = subjectname;
        this.level = levelname;

    }
}

module.exports = Module;