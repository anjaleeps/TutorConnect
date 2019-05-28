const operations = require('./app/Users/Tutors/TutorDBManager.js')
const assert = require('assert')
const chai = require('chai')
var expect = chai.expect;

it('getTutor', function(done) {
    operations.getTutor(1, function(err, results){
        expect(results.length).to.equal(1);
        done();
    });
});
it('searchTutors', function(done) {
    operations.searchTutors(3,4,'jaffna', function(err, results){
        expect(results.length).to.equal(1);
        done();
    });
});
it('logTutor', function(done) {
    operations.logTutor(2, function(err, results){
        expect(results.length).to.equal(1);
        done();
    });
});
it('getContactNo', function(done) {
    operations.getContactNo(1, 5, function(err, results){
        expect(results.length).to.equal(1);
        done();
    });
});
it('getClassRequests', function(done) {
    operations.getClassRequests(1, function(err, results){
        expect(results.length).to.equal(1);
        done();
    });
});
it('getAreas', function(done) {
    operations.getAreas(function(err, results){
        expect(results.length).to.equal(6);
        done();
    });
});

