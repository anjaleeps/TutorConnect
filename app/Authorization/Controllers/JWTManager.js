const jwt = require('jsonwebtoken');
const privateKey = require('../Configs/env.config.js')['jwt_privateKey'];
const publicKey = require('../Configs/env.config.js')['jwt_publicKey'];

var options = {
    expiresIn: "1d",
    algorithm: "RS256"
};

exports.createToken = function (req, res, user) {
    var payload = {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        permissionLevel: user.permissionLevel
    }
    var token = jwt.sign(payload, privateKey, options);
    res.writeHead(201, {
        'Authorization': 'Bearer ' + token
    });
    res.write(JSON.stringify(user));
    res.end();
}

exports.verifyToken = function (req, res) {
    var token = (req.headers.authorization).substr(7);
    console.log(token);
    if (token !== null) {
        try {
            req.access_token = jwt.verify(token, publicKey, options);
        } catch (err) {
            console.log("d"+req.access_token);
            if (err.name === 'TokenExpiredError') {
                var payload = jwt.verify(token, publicKey, { ignoreExpiration: true });
                var token = jwt.sign(payload, privateKey, options);
                req.access_token = jwt.verify(token, publicKey, options);

            } else {
                res.statusCode = 400;
                res.end();
            }

        }
    }
}

