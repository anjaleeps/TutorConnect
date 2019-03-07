var mysql = require('mysql');
var url = require('url');

var con = mysql.createConnection({
    host: "127.0.0.1",
    database: "tutorconnect",
    user: "root",
    password: "Notwithstand123"
});

con.connect(function (err) {
    if (err) { console.log(err) }
    console.log("Connected!");
});

exports.searchTutors =function(requesturl,callback) {
    var q = url.parse(requesturl,true);
    var homeTown = q.query.homeTown;
    console.log(homeTown);
    var query = "SELECT tutor_id,firstname,lastname,picture,rating FROM tutors where area = ?"
    con.query(query,[homeTown], function (err, result) {
        if (err) { console.log(err) }
        console.log(result);
        callback(null,result);
    });
    
}


