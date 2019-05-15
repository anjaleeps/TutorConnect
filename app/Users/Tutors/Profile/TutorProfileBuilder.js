const profile = require('./TutorProfile.js');
const moduleCtrl = require('../../../Modules/ModuleController.js');
const Comment = require('./Comment.js');
const dbManager = require('./TutorProfileDBManager.js');

exports.TutorProfileBuilder = function (req, res, id) {
    var tutorProfile = profile.getTutorProfile(id);
    tutorProfile.addComments(getComments(req,res,id));
    tutorProfile.addModules(moduleCtrl.getTutorModules(req, res, id));

    function getComments(req, res, tutorId) {
        var comments = [];
        dbManager.getComments(req, res, tutorId, function (err, results) {
            for (i = 0; i < results.length; i++) {
                comments.push(new Comment(results[i].tutor_id, results[i].student_id, results[i].comment_content, results[i].comment_time));
            }
        });

        return comments;
    }

    return tutorProfile;
}

