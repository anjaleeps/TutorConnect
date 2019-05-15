const db = require('../Database/database');
var query;

exports.createUser = function (req, res, email, password, callback) {
    var id;
    query = "INSERT INTO users (email_address,pwd) VALUES (?,?)";
    db.query(query, [email, password], function (err, results) {
        if (err) {
            res.setStatus(400);
            res.write(err);
            res.end();
        }
        callback(null, result[0]);       
    });
}

exports.getUser = function (req, res, email, callback) {
    query = "SELECT * FROM users WHERE email_address=?";
    db.query(query, email, function (err, result) {
        if (err) {
            res.setStatus(400);
            res.write(err);
            res.end();
        }
        else {
            if (result.length > 0) {
                callback(null,result[0]);
            }
            else {
                res.tatusCode(400);
                res.write(err);
                res.end();
            }
        }
    });
}

