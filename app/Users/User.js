'use strict'

const auth = require('../Authorization/routes.config.js');
const dbManager = require('./UserDBManager');
var within = false;

class User {

    constructor(email, pwd, id, type) {
        if (within === true) {
            this.email = email;
            this.pwd = pwd;
            this.id = id;
            this.type = type;
            this.permsissionLevel;
            within = false;
        } else {
            throw new Error('Cannot access private constructor');
        }
    }

    set permissionLevel(level) {
        this.permissionLevel = level;
    }

    get permissionLevel() {
        return this.permissionLevel;
    }

    get email() {
        return this.email;
    }

    get pwd() {
        return this.pwd;
    }

    get id() {
        return this.id;
    }
    get type() {
        return this.type;
    }

    getJWT(req, res, user) {
        return auth.createToken(req, res, user);
    }

    validateEmail(req, res) {
        auth.validateEmail(req, res, this.email);
    }

    validatePassword(req, res) {
        auth.validatePassword(req, res, this.password);
    }

    hashPassword(req, res) {
        auth.hashPassword(req, res, this.pwd);
    }

    verifyPassword(req, res, hash) {
        auth.verifyPassword(req, res, this.pwd, hash);
    }

    static createUser(req, res, data) {
        within = true;
        var user = new User(data.email, data.password, 'undefined', data.type);
        user.validateEmail(req, res);
        user.validatePassword(req, res);
        user.hashPassword(req, res);

        dbManager.createUser(req, res, user.email, user.pwd, function (err, result) {
            user.id = result.user_id;
        });
        return user;
    }

    static getUser(data) {

        within = true;
        var user = new User(data.email, data.password, 'undefined', 'undefined');
        user.validateEmail(req, res);

        dbManager.getUser(req, res, user.email, function (err, result) {
            user.id = result.user_id;
            user.type = result.type_id;
            auth.verifyPassword(req, res, user.pwd, result.pwd);
            user.pwd = result.pwd;
        });
        return user;
    }
}

module.exports = User;

