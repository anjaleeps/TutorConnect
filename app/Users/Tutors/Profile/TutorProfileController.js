const TutorProfileBuilder = require('./TutorProfileBuilder.js');
const Comment = require('./Comment.js');

exports.getProfile = function (req, res, id) {
    var profile = TutorProfileBuilder(req, res, id);   
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify(profile));
    res.end();

}

exports.editComment = function (tutorId, studetId, newContent) { }