const emailValidator = require('email-validator');
const jwtManager = require('../Controllers/JWTManager');
const passwordEncryptor = require('bcrypt');

const specialChar = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

exports.validateEmail = function (req, res, email) {
    if (!emailValidator.validate(email)) {
        res.statusCode=400;
        res.write("Invalid email address");
        res.end();
        return false;
    }
    return true;
}

exports.validatePassword = function (req, res, password) {

    if (password.length < 8) {
        console.log("false");
        res.statusCode=400;
        res.write("Password should contain at least 8 characters");
        res.end();
        return false;
    }
    else if (password.length > 100) {
        console.log("false");
        res.statusCode=400;
        res.write("Password cannot be longer than 100 characters");
        res.end();
        return false;
    }
    // else if (!(/\d/.test(password))) {
    //     res.setStatus(400);
    //     res.write("Password should contain at least 1 digit");
    //     res.end();
    //     return false;
    // }
    // else if (!(/[a-z]/.test(password))) {
    //     res.setStatus(400);
    //     res.write("Password should contain at least 1 lowercase letter");
    //     res.end();
    //     return false;
    // }
    // else if (!(/[A-Z]/.test(password))) {
    //     res.setStatus(400);
    //     res.write("Password should contain at least one uppercase letter");
    //     res.end();
    //     return false;
    // }
    else if (/\s/.test(password)) {
        console.log("false");
        res.statusCode=400;
        res.write("Password cannot contain white spaces");
        res.end();
        return false;
    }
    // else if (!(specialChar.test(password))) {
    //     res.setStatus(400);
    //     res.write("Password should contain atleast one special character");
    //     res.end();
    //     return false;
    // }
    console.log("true");
    return true;
}

exports.verifyPassword = function (req, res, password, hash, callback) {
    return passwordEncryptor.compare(password, hash, function(err, result){
        callback(err, result);
    });
}

exports.hashPassword = function (req, res, password, callback) {
    passwordEncryptor.hash(password, 10, function (err, pwd) {
        if (err) {
            callback(err);
            res.statusCode=400;
            res.write(err);
            res.end();
        }  
        callback(err, pwd);
    });
}

