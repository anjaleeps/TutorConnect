'use strict'

const dbManager = require('./ModuleDBManager');
var levels = [];

class Level {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.subjects = {};

        dbManager.getSubjects(id, function (err, results) {
            if (!err) {
                for (i = 0; i < results.length; i++) {
                    subjects[results[i].subject_name] = results[i].subject_id;
                }
            }           
        });
       
        console.log(this);
        levels.push(this);
    }

    get subjects() {
        return this.subjects;
    }

    get name() {
        return this.name;
    }
}

exports.getLevels = function () {
    console.log(JSON.stringify(levels));
    return levels;
}
module.exports = Level;