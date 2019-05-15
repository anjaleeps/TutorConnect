var levels = {};

function Level(id, name, subjects) {
    this.id = id;
    this.name = name;
    this.subjects = subjects;
    levels[name]=this;
}

Level.prototype.getLevelFromName= function(name){
    return levels[name];
}
Level.prototype.getSubjects = function () {
    return this.subjects;
}

Level.prototype.getSubjectByName = function (name) {
    return this.subjects[name];
}

module.exports = Level;