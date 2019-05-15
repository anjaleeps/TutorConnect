const dbManager = require('./TutorProfileDBManager.js');

function TutorProfile(id) {
    this.id = id;
    this.description = '';
    this.qualifs = [];
    this.comments = [];
    this.videos = [];
    this.modules = [];

}

TutorProfile.prototype.addQualifs = function () {
    var qualifics;
    dbManager.getQualifs(id, function (err, results) {
        
        qualifics = results;
    });
    for (i = 0; i < qualifics.length; i++) {
        this.qualifs.push(qualifics[i]);
    }
}

TutorProfile.prototype.addDesc = function () {
    var desc;
    dbManager.getDesc(id, function (err, results) {
        desc = results;
    });
    this.description = desc;
}

TutorProfile.prototype.addComments = function (comments) {
    this.comments = comments;
}

TutorProfile.prototype.addModules = function (modules) {
    this.modules = modules;
}

module.exports = {
    getTutorProfile: function(id) {
        var profile = new TutorProfile(id);
        profile.addDesc();
        profile.addQualifs();
    }
}