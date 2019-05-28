const operations = require('./app/Modules/ModuleDBManager.js')
const assert = require('assert')
const chai = require('chai')
var expect = chai.expect;
var newClass ={
    tutor: 1,
    student: 4,
    level: "Grade 6-9",
    subject: "History",
    starttime: "03:00 PM",
    endtime: "05:00 PM",
    day: "Sunday"
}


it('getSubject', function(done) {
    operations.getSubjects(1, function(err, results){
        expect(results.length).to.equal(5);
        done();
    });
});  
it('getLevels', function(done) {
    operations.getLevels(function(err, results){
        expect(results[2].level_name).to.equal("Grade 6-9");
        done();
    });
}); 
it('getClasses', function(done) {
    operations.getClasses(1, function(err, results){
        expect(results.length).to.equal(3);
        done();
    });
});   
it('getTutorModules', function(done) {
    operations.getTutorModules(1, function(err, results){
        expect(results.length).to.equal(3);
        done();
    });
}); 
it('startClass', function(done) {
    operations.startClass(newClass, function(err, results){
        expect(results.insertId).to.equal(1);
        done();
    });
}); 

it('getEndedClasses', function(done) {
    operations.getEndedClasses(4, function(err, results){
        expect(results.length).to.equal(0);
        done();
    });
}); 
