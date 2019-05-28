'use strict'

class Calendar{
    constructor(id){
        this._id=id;
        this._classes=[];
    }

    get id(){
        return this._id;
    }

    get classes(){
        return this._classes;
    }

    set classes(clzs){
        this._classes=clzs;
    }
}

module.exports=Calendar;