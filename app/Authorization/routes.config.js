const jwtManager = require('./Controllers/JWTManager.js');
const validator = require('./Middleware/Validate.js');
const permission = require('./Middleware/Permission.js');

module.exports = {
    validateEmail: (req, res, email) => {
        return validator.validateEmail(req, res, email);
    },

    validatePassword: (req, res, password) => {
        return validator.validatePassword(req, res, password);
    },
    verifyToken: (req, res) => {
        jwtManager.verifyToken(req, res);
    },
    hashPassword: (req, res, password, callback) => {
        validator.hashPassword(req, res, password, function(err, pwd){
            callback(err, pwd);
        });
    },
    createToken: (req, res, user) => {
        jwtManager.createToken(req, res, user);
    },
    verifyPassword: (req, res, password, hash, callback) => {
        validator.verifyPassword(req, res, password, hash, function(err, result){
            callback(err, result);
        });
    },
    hasMinimumPermissionLevelRequired: (req_permission_level, user_permission_level) => {
        return permission.hasMinimumPermissionLevelRequired(req_permission_level, user_permission_level);
    },
    isSameUser: (user_id, required_id) => {
        return permission.onlySameUserHasPermission(user_id,required_id);
    }

}