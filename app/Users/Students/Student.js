const User = require('../User.js');


'use strict'

class Student extends User{
    
    constructor(id, firstname, lastname, rating, area, picture) {
            super(id, firstname, lastname, picture);
            this._type=1;
            //tutors.push(this);
    }
    
}


module.exports=Student;
