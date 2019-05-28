const dbManager = require('./TutorProfileDBManager.js');

'use strict'

class ProfileFunctions {
    constructor() {
        
    }

    editProfile(req, res, type, query) {
        if (type == "module") {
            this._addModule(req, res, query);
        }
        else if (type == "qualif") {
            this._addQualif(req, res, query);
        }
        else if (type == "desc") {
            this._addDesc(req, res, query);
        }
        else if (type == "area") {
            this._addArea(req, res, query);
        }
        else if (type == "name") {
            this._addName(req, res, query);
        }
        
    }

    _addModule(req, res, query) {
        dbManager.addModule(query, function (err, result) {
            if (!err) {
                res.statusCode = 201;
                res.end((result.insertId).toString());
                return;
            }
            res.statusCode = 501;
            res.end();
        });
    }

    _addQualif(req, res, query) {
        dbManager.addQualif(query, function (err, result) {
            if (!err) {
                res.statusCode = 201;
                res.end((result.insertId).toString());
                return;
            }
            res.statusCode = 501;
            res.end();
        });
    }

    _addDesc(req, res, query) {
        dbManager.addDesc(query, function (err, result) {
            if (!err) {
                res.statusCode = 201;
                res.end();
                return;
            }
            res.statusCode = 501;
            res.end();
        });
    }

    _addArea(req, res, query) {
        dbManager.addArea(query, function (err, result) {
            if (!err) {
                res.statusCode = 201;
                res.end();
                return;
            }
            res.statusCode = 501;
            res.end();
        });
    }

    _addName(req, res, query) {
        dbManager.addName(query, function (err, result) {
            if (!err) {
                res.statusCode = 201;
                res.end();
                return;
            }
            res.statusCode = 501;
            res.end();
        });
    }

   
}

module.exports = ProfileFunctions;
