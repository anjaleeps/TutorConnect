const operations = require('./app/Users/Tutors/Calendar/TutorCalDBManager')
const assert = require('assert')
const chai = require('chai')
var expect = chai.expect;

it('getFreeslots', function(done) {
    operations.getFreeslots(1, function(err, results){
        expect(results.length).to.equal(1);
        done();
    });
});

it('addFreeslot', function(done) {
    operations.getFreeslots(1, '8:30 AM', '10:30 AM', 'Friday', function(err, results){
        expect(results.length).to.equal(1);
        done();
    });
});