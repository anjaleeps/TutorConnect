const operations = require('./app/Users/Students/StudentDBManager.js')
const assert = require('assert')
const chai = require('chai')
var expect = chai.expect;

it('getStudent', function(done) {
    operations.getStudent(5, function(err, results){
        expect(results.length).to.equal(1);
        done();
    });
});
it('logStudent', function(done) {
    operations.logStudent(5, function(err, results){
        expect(results.length).to.equal(1);
        done();
    });
});