const dbManager = require('./TutorDBManager.js');
const User = require('../User.js');

var tutors = [];

'use strict'

class Tutor extends User{
    
    constructor(id, firstname, lastname, rating, area, picture) {
            super(id, firstname, lastname, picture);
            this._rating = rating;
            this._area = area;
            this._type=2;
            tutors.push(this);
    }

    get rating() {
        return this._rating;
    }

    get area() {
        return this._area;
    }
  
    static getTutorInstance(id) {
        return tutors[id];
    }

    

}


module.exports=Tutor;

