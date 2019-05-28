const ProfileBuilder = require('../../ProfileBuilder.js');
const TutorProfile = require('./TutorProfile.js');
const dbManager = require('./TutorProfileDBManager.js');

let instance = null;

class TutorProfileBuilder extends ProfileBuilder {
    constructor() {
        if (!instance){
            super();
            instance=this;
        }
        return instance;
    }

    build(req, res, id) {
        var tutorProfile = new TutorProfile(id);
        //console.log(tutorProfile);
        var modules = [];
        dbManager.getModules(id, function (err, results) {
            if (!err) {
                for (var i = 0; i < results.length; i++) {
                    var module = {
                        id: results[i].module_id,
                        subject: results[i].subject_name,
                        level: results[i].level_name
                    }
                    console.log(module);
                    modules.push(module);
                }
                tutorProfile.modules = modules;

            }

            var comments = [];
            dbManager.getComments(id, function (err, results) {
                if (!err) {
                    for (var j = 0; j < results.length; j++) {
                        var comment = {
                            student: results[j].firstname + " " + results[j].lastname,
                            content: results[j].comment_content,
                            time: results[j].comment_time
                        }
                        comments.push(comment);
                    }
                    tutorProfile.comments = comments;
                }

                var qualifs = [];
                dbManager.getQualifs(id, function (err, results) {
                    if (!err) {
                        for (var k = 0; k < results.length; k++) {
                            var qualif = {
                                id: results[k].id,
                                qualification: results[k].qualification
                            }
                            qualifs.push(qualif);
                        }
                        tutorProfile.qualifs = qualifs;
                    }

                    dbManager.getAdditional(id, function (err, result) {
                        if (!err) {
                            if (result.length == 1) {
                                tutorProfile.description = result[0].description;
                                tutorProfile.rated = result[0].rated;
                                tutorProfile.rating = result[0].rating;
                                console.log(tutorProfile);

                            }
                        }
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.write(JSON.stringify(tutorProfile));
                        res.end();
                        return;
                    });
                });
            });
        });
    }

    postComment(req, res, id, newComment) {
        dbManager.checkPermission(id, newComment.studentId, function (err, result) {
            if (!err && result.length == 1) {
                dbManager.postComment(id, newComment, function (err, result) {
                    if (!err) {
                        res.statusCode = 200;
                        res.end();
                    }
                });
            }
        });

    }

    addRating(req, res, tutorId, studentId, rating) {
        dbManager.checkPermission(tutorId, studentId, function (err, result) {
            if (!err && result.length == 1) {
                dbManager.addRating(tutorId, studentId, rating, function (err, result) {
                    if (!err) {
                        res.statusCode = 200;
                        res.end();
                    }
                });
            }
        });
    }
}

module.exports = TutorProfileBuilder;
