var express = require('express');
var request = require('request');
var router = express.Router();

/* Render Webcam Page. */
router.get('/', function(req, res, next) {});
router.post('/', function(req, res, next) {
    var snapshot = req.body.img;

    if (snapshot.length <= 0) {
        console.log("No image captured");
        res.send("HILO - error");
        return false;
    }

    // Implement the Other Things Here
    var options = {
        url : 'https://gateway-a.watsonplatform.net',
        path : '/visual-recognition/api',
        method : 'POST',
        // headers: { 'Authorization': 'Basic ' + new Buffer(username + ':' + passw).toString('base64') },
        multipart: true,
        data: {
            "api_key": "b1da1c8369f4eb39a46a727ccc31e12f327ee1a0",
            "version": "2016-05-20",
            "images_file": snapshot
        }
    };
    var response = request(options, function(err, result, html){
        console.log(result);
        console.log("Error:"+err);
        res.send("HILO");
    });

    console.log("Ennd of response");
    res.send("HILO - end");
    
});

module.exports = router;