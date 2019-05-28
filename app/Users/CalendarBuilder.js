const moduleCtrl = require('../Modules/ModuleController.js');

'use strict'

let instance = null;

class CalendarBuilder{
    constructor(){
        if (!instance){
            instance =this;
        }
        return instance;
    }

    buildClasses(id, callback){
        moduleCtrl.getClasses(id, function(err, classes){
            callback(err, classes);
        });
    }
}

module.exports=CalendarBuilder;