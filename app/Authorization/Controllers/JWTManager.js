const jwt = require('jsonwebtoken');
const privateKey = require('../Configs/env.config.js')['jwt_privateKey'];
const publicKey = require('../Configs/env.config.js')['jwt_publicKey'];

var options = {
    expiresIn: "30d",
    algorithm: "RS256"
};

exports.createToken = function (req, res, user) {
    var payload = JSON.stringify(user, replacer);
    var token = jwt.sign(payload, privateKey, options);
    response.writeHead(302, {
        'Location': 'http://localhost:8080/home.html',
        'Authorization': 'Bearer '+token
    });
    response.write(JSON.stringify(user, replacer));
    response.end();
}

exports.verifyToken = function (req, res) {
    var token = (req.headers.authorization).substr(7);
    console.log("token" + token);
    if (token !== '') {
        try {
            req.access_token = jwt.verify(token, publicKey, options);
            return jwt.verify(token, publicKey, options);
        } catch (err) {
            res.statusCode = 400;
            //console.log(err);
            res.write(err);
            res.end();
        }
    }
}

function replacer(key, value) {
    if (key == 'pwd') { return 'undefined' }
}