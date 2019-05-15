
exports.hasMinimumPermissionLevelRequired = function (req_permission_level, user_permission_level) {
    if (!(req_permission_level & user_permission_level)) {
        return false;
    }
    return true;
}

exports.onlySameUserHasPermission = function (user_id, required_id) {
    if (user_id !== required_id) {
        return false;
    }
    return true;
}
