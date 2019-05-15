const emailValidator = require('email-validator');
const jwtManager = require('../Controllers/JWTManager');
const passwordEncryptor = require('bcrypt');

const specialChar = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

exports.validateEmail = function (req, res, email) {
    if (!emailValidator.validate(email)) {
        res.setstatus(400);
        res.write(err);
        res.end();
    }
}

exports.validatePassword = function (req, res, password) {

    if (password.length < 8) {
        res.setStatus(400);
        res.write("Password should contain at least 8 characters");
        res.end();
    }
    else if (password.length > 100) {
        res.setStatus(400);
        res.write("Password cannot be longer than 100 characters");
        res.end();
    }
    else if (!(/\d/.test(password))) {
        res.setStatus(400);
        res.write("Password should contain at least 1 digit");
        res.end();
    }
    else if (!(/[a-z]/.test(password))) {
        res.setStatus(400);
        res.write("Password should contain at least 1 lowercase letter");
        res.end();
    }
    else if (!(/[A-Z]/.test(password))) {
        res.setStatus(400);
        res.write("Password should contain at least one uppercase letter");
        res.end();
    }
    else if (/\s/.test(password)) {
        res.setStatus(400);
        res.write("Password cannot contain white spaces");
        res.end();
    }
    else if (!(specialChar.test(password))) {
        res.setStatus(400);
        res.write("Password should contain atleast one special character");
        res.end();
    }
}

exports.verifyPassword = function (req, res, password, hash) {
    return passwordEncryptor.compare(req, res, password, hash);
}

exports.verifyUser = function (req, res, token) {
    jwtManager.verifyToken(req, res, token);
}


exports.hashPassword = function (req, res, password) {
    var pass;
    passwordEncryptor.hash(password, 10, function (err, pwd) {
        if (err) {
            res.setStatus(400);
            res.write(err);
            res.end();
        }  
        pass = pwd;
    });
    return pass;
}

