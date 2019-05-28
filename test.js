const operations = require('./app/Users/Tutors/Profile/TutorProfileDBManager.js')
const assert = require('assert')
const chai = require('chai')
var expect = chai.expect;

it('getAdditional', function(done) {
    operations.getAdditional(1, function(err, results){
        expect(results.length).to.equal(1);
        done();
    });
});
it('getQualifs', function(done) {
    operations.getQualifs(1, function(err, results){
        expect(results.length).to.equal(0);
        done();
    });
});
it('getComments', function(done) {
    operations.getComments(1, function(err, results){
        expect(results.length).to.equal(0);
        done();
    });
});
it('getModules', function(done) {
    operations.getModules(1, function(err, results){
        expect(results.length).to.equal(3);
        done();
    });
});
