const userConfig = require('../Authorization/Configs/env.config.js');
const auth = require('../Authorization/routes.config.js');
const dbManager = require('./CalendarDBManager.js');
const userCtrl = require('./UserController.js');

const USER = userConfig.permissionLevels.USER;

CalendarBuilder = function (req, res, id) {
   
}

CalendarBuilder.prototype.getClasses = function (req, res, id) {
    if (req.headers && req.headers.authorization) {
       
        var token = auth.verifyUser(req, res);
        if (auth.hasMinimumPermissionLevelRequired(USER, token.permissionLevel) && auth.isSameUser(token.id, id)) {
            var classes = [];
            dbManager.getClasses(req, res, id, function (err, results) {
                for (i = 0; i < results.length; i++) {
                    var tutor = JSON.stringify(userCtrl.getTutorInstance(results[i].ttr_id), replacer);
                    var student = JSON.stringify(userCtrl.getStudentInstance(results[i].stu_id), replacer);
                    var new_class = new Class(tutor, student, results[i].level_name, results[i].subject_name, results[i].start_time, results[i].end_time, results[i].weekday);
                    classes.push(new_class);
                }
            });
            return classes;
        }
    }
    return [];
}

function replacer(key, value) {
    if (key == 'pwd') { return 'undefined' }
    if (key == 'email') { return 'undefined' }
}

module.exports = CalendarBuilder;