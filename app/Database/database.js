const mysql = require('mysql');

var pool = mysql.createPool({
    connectionLimit: 10,
    multipleStatements: true,
    host: "127.0.0.1",
    database: "tutorconnect",
    user: "root",
    password: "Notwithstand123",
    port: "3306"
});

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


function query(query, params, callback) {

    pool.getConnection(function (err, connection) {
        if (err) {
            console.log("connected not");
            console.log(err);
            connection.release();
            callback(err.code, null);
        }
        console.log("connected");
        connection.query(query, params, function (err, results) {
            connection.release();
            if (!err) {
                console.log(results);
                callback(null, results);
                console.log("reached err");
            }
            else {
                console.log("reached");
                callback(err.code, null);

            }

        });

        connection.on('error', function (err) {
            connection.release();
            callback(err.code, null);
        });

    });

}





exports.getLevels = function (callback) {
    var q = "SELECT level_name FROM levels";
    con.query(q, function (err, result) {
        if (err) { console.log(err) }
        console.log(result);
        callback(null, result);
    });

}