const db = require('../Database/Database.js');

exports.createUser = function (email, password, type, callback) { 
    var query = "INSERT INTO users (email_address,pwd, type_id) VALUES (?,?,?)";
    db.query(query, [email, password, type], function (err, result) {
        console.log(result);
        callback(err, result);       
    });
}

exports.logUser = function (email, callback){
    var query = "SELECT user_id, pwd, type_id FROM users WHERE email_address=?";
    db.query(query, [email], function(err,result){
        callback(err, result);
    });
}