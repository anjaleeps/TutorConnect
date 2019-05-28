const Profile = require('../../Profile.js');

'use strict'

class TutorProfile extends Profile {
    constructor(id) {
        super(id);
        this._description = '';
        this._rated=0;
        this._rating=0;
        this._qualifs = [];
        this._comments = [];
        this._videos = [];
        this._modules = [];
    }

    set description(desc){
        this._description=desc;
    }

    set qualifs(qualifs){
        this._qualifs=qualifs;
    }

    set comments(comments){
        this._comments=comments;
    }

    set modules(modules){
        this._modules=modules;
    }
    set rated(rated){
        this._rated=rated;
    }
    set rating(rating){
        this._rating=rating;
    }
}

module.exports=TutorProfile;