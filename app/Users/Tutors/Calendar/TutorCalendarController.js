const TutorCalendarBuilder = require('./TutorCalendarBuilder.js');
const dbManager = require('../TutorDbManager.js');
const FreeSlot = require('./FreeSlot.js');
const userConfig = require('../../../Authorization/Configs/env.config.js');
const auth = require('../../../Authorization/routes.config.js');

const TUTOR = userConfig.permissionLevels.TUTOR;

exports.getCalendar = function (req, res, id) {
    var cal = TutorCalendarBuilder.build(req, res, id);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify(cal));
    res.end();
}

exports.updateCalendar = function (req, res, params) {
    if (re.access_token) {
        var token = req.access_token;
        if (auth.hasMinimumPermissionLevelRequired(TUTOR, token.permissionLevel) && auth.isSameUser(token.id, params.userId)) {
            var action = params.action;
            var userId = params.userId;
            var data = JSON.parse(params.timeslot);
            var newFreeSlot = new FreeSlot(data.starttime, data.endtime, data.day);
            if (action == "add") {
                addFreeSlot(req, res, newFreeSlot, userId);
            }
            else if (action == 'remove') {
                removeFreeSlot(req, res, newFreeSlot, userId);
            }
        }
        res.statusCode = 403;
        
        res.end();
    }
    res.statusCode = 403;
   
    res.end();
}

function addFreeSlot(req, res, newFreeSlot, tutorId) {
    dbManager.addFreeSlot(req, res, newFreeSlot, tutorId);
}

function removeFreeSlot(req, res, newFreeSlot, tutorId) {
    dbManager.removeFreeSlot(req, res, newFreeSlot, tutorId);
}

exports.getFreeSlots = function (req, res, tutorId) {
    if (req.access_token !== null) {
        var token = req.access_token;
        if (auth.hasMinimumPermissionLevelRequired(TUTOR, token.permissionLevel) && auth.isSameUser(token.id, params.userId)) {
            var freeSlots = TutorCalendarBuilder.getFreeSlots(req, res, tutorId);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify(freeSlots));
            res.end();

        }
        res.statusCode = 403;
        
        res.end();
    }
    res.statusCode = 403;
   
    res.end();
}

