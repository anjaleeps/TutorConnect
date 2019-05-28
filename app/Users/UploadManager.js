const multer = require('multer');
const qs = require('querystring');

'use strict'

class UploadManager{
    constructor(){
       
    }

    uploadPicture(req, res) {
        var storage = multer.diskStorage({
            destination: function (req, file, callback) {
                console.log('heyher')
                callback(null, '../Uploads/Images');
            },
            filename: function (req, file, callback) {
                console.log("heyhey")
                var filetype = file.name.substr(file.name.lastIndexOf('.'));
                callback(null, "profpic" + req.access_token.id + '-' + Date.now() + filetype);
            }
        });
        //console.log(req.body);
        var upload = multer({ storage: storage }).single('img');
        upload(req, res, function (err) {
            if (err) {
                return console.log(err);
            }
            console.log(req.files);
            console.log(req.body);
            console.log("success");
        });
    }
}

module.exports = UploadManager;