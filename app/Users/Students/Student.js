'use strict'

const dbManager = require('./StudentDBManager');
const User = require('../User.js');
const userConfig = require('../../Authorization/Configs/env.config.js');
const profileBuilder = require('./StudentProfileBuilder.js');

const STUDENT = userConfig.permissionLevels.STUDENT;

var within = false;
let students = {}

class Student extends User {

    constructor(id, email, password, type, firstname, lastname, picture) {
        if (within) {
            super(email, password, id, type);
            this.firstname = firstname;
            this.lastname = lastname;
            this.picture = picture;
            within = false;
        } else {
            throw new Error('Cannot access private constructor');
        }
    }  

    static getStudentInstance(req, res, id) {
        if (!(id in students)) {
            within = true;
            var result = dbManager.getStudent(req, res, id) 
            students[id] = new Student(result.student_id, result.email_address, result.pwd, 1, result.firstname, result.lastname, result.picture);
        }
        return students[id];
    }

    static studentSignin(data) {
        within = true;
        var student = new Student(null, data.email, data.pwd, data, 1, firstname, data.lastname, null);
        student.id = User.createUser(req, res, data);
        db.createStudent(req, res, student.id, student.email, student.pwd, student.firstname, student.lastname);
        students[student.id] = student;
        student.permissionLevel = STUDENT;
        return student.getJWT(req, res, student);
    }

    static studentLogin(id) {
        var student = getStudentInstance(req, res, id);
        student.permissionLevel = STUDENT;
        return student.getJWT(req, res, student);
    }
}






