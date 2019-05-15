'use strict'

class Calendar {

    constructor(id) {
        this.userId = id;
        this.classes = [];
    }

    set classes(classes) {
        this.classes = classes;
    }

}

module.exports = Calendar;



