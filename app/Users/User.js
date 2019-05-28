const config = require('../Authorization/Configs/env.config.js');

const PUBLIC = config.permissionLevels.PUBLIC;

'use strict'

class User{
    constructor(id, firstname, lastname,picture){
        this._id=id;
        this._firstname=firstname;
        this._lastname=lastname;
        this._picture=picture;
        this._permissionLevel=PUBLIC;
    }
 
    get firstname() {
        return this._firstname;
    }

    get lastname() {
        return this._lastname;
    }

    get id(){
        return this._id;
    }

    get permissionLevel(){
        return this._permissionLevel
    }

    set permissionLevel(level){
        this._permissionLevel=level;
    }

}

module.exports=User;