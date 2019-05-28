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


exports.query= function(query, params, callback) {

    pool.getConnection(function (err, connection) {
        if (err) {
            console.log("connected not");
            console.log(err);
            connection.release();
            callback(err.code, null);
            return;
        }
        console.log("connected");
        connection.query(query, params, function (err, results) {
            connection.release();
            if (!err) {
                console.log(results);
                callback(null, results);
                console.log("reached");
                
            }
            else {
                console.log("reached err");
                console.log(err);
                callback(err, null);

            }

        });

        connection.on('error', function (err) {
            connection.release();
            callback(err, null);
        });

    });

}

