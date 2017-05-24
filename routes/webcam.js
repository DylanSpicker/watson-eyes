var express = require('express');
var router = express.Router();

/* Render Webcam Page. */
router.get('/', function(req, res, next) {
    res.render('webcam', { title: 'Webcam'});
});

module.exports = router;