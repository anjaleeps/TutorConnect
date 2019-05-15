const jwtManager = require('./Controllers/JWTManager.js');
const validator = require('./Middleware/Validate.js');
const permission = require('./Middleware/Permission.js');

module.exports = {
    validateEmail: (req, res, email) => {
        validator.validateEmail(req, res, email);
    },

    validatePassword: (req, res, password) => {
        validator.validatePassword(req, res, password);
    },
    verifyUser: (req, res, token) => {
        validator.verifyUser(req, res, token);
    },
    hashPassword: (req, res, password) => {
        return validator.hashPassword(req, res, password);
    },
    createToken: (req, res, user) => {
        jwtManager.createToken(req, res, user);
    },
    verifyPassword: (req, res, password, hash) => {
        validator.verifyPassword(req, res, password, hash);
    },
    hasMinimumPermissionLevelRequired: (req_permission_level, user_permission_level) => {
        return permission.hasMinimumPermissionLevelRequired(req_permission_level, user_permission_level);
    },
    isSameUser: (user_id, required_id) => {
        return permission.onlySameUserHasPermission(user_id,required_id);
    }

}