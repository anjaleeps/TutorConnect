'use strict'

const dbManager = require('./TutorDBManager');
const User = require('../User.js');
const userConfig = require('../../Authorization/Configs/env.config.js');


const TUTOR = userConfig.permissionLevels.TUTOR;
const STUDENT =userConfig.permissionLevels.STUDENT;

var within = false;
let tutors = {}

class Tutor extends User {

    constructor(id, email, password, type, firstname, lastname, area, picture, rating) {
        if (within) {
            super(email, password, id, type);
            this.firstname = firstname;
            this.lastname = lastname;
            this.area = area;
            this.picture = picture;
            this.rating = rating;
        } else {
            throw new Error('Cannot access private constructor');
        }
    }

    set picture(picture) {
    }

    static getTutorInstance(req, res, id) {
        if (!(id in tutors)) {
            within = true;
            var result = dbManager.getTutor(req, res, id)
            tutors[id] = new Tutor(result.tutor_id, result.email_address, result.pwd, 2, result.firstname, result.lastname, result.picture, result.rating, result.area);
        }
        return tutors[id];
    }

    static tutorSignin(req, res, data) {
        within = true;
        var tutor = new Tutor(null, data.email, data.pwd, 2, data, firstname, data.lastname, null, 0.0, data.area);
        tutor.id = User.createUser(req, res, data);
        db.createTutor(req, res, tutor.id, tutor.email, tutor.pwd, tutor.firstname, tutor.lastname, tutor.area);
        tutor.permissionLevel = TUTOR;
        tutors[tutor.id] = tutor;
        return tutor.getJWT(req, res, tutor);
    }

    static tutorLogin(id) {
        var tutor = getTutorInstance(req, res, id);
        tutor.permissionLevel = TUTOR;
        return tutor.getJWT(req, res, tutor);
    }

    static searchTutors(req, res, level, subject, area) {
        var tutors = [];
        dbManager.searchTutors(req, res, level, subject, area, function (err, results) {
            for (i = 0; i < results.length; i++) {
                tutors.push(Tutor.getTutorInstance(result[i].tutor_id));
            }
        });
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify(tutors, replacer));
        res.end();
    }

    static getTutorContact(req, res, tutorId, studentId) {
        var token = req.token;
        if (token && auth.hasMinimumPermissionLevelRequired(STUDENT, token.permissionLevel)) {
            dbManager.getTutorContact(req, res, tutorId, studentId, function (err, result) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.write(result[0]);
                res.end();
            });
        } else {
            res.writeHead(302, {
                'Location': 'http://localhost:8080/signin.html',
            });
            //response.write(JSON.stringify(user, replacer));
            res.end();
        }
    }
}

function replacer(key, value) {
    if (key == 'pwd') { return 'undefined' }
    if (key == 'email') { return 'undefined' }
}



module.exports = Tutor;

