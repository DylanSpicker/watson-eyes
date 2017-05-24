var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
var crypto = require('crypto');

var watson = require('watson-developer-cloud');
var visual_recognition = watson.visual_recognition({
  api_key: 'b1da1c8369f4eb39a46a727ccc31e12f327ee1a0',
  version: 'v3',
  version_date: '2016-05-19'
});


var index = require('./routes/index');
var users = require('./routes/users');
var webcam = require('./routes/webcam');
// var analyze = require('./routes/analyze');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', index);
// app.use('/users', users);
app.use('/', webcam);

// API CALLS

app.post('/visual-analysis/face', function(req, res){
  var snapshot = req.body.img;
  var message = "";

  if (snapshot.length <= 0) {
    message = "Error: No image provided";
    console.log(message);
    res.send(message);
  } else {

    // Create File Name (MD5 of the Base 64 String) + Path (snapshot/tmp_{name})
    var name = crypto.createHash('md5').update(snapshot).digest("hex"),
        file_path = "./snapshot/tmp_"+name+".jpg";
    
    // Write the file to the snapshot directory
    var base64Data = snapshot.replace(/^data:image\/jpeg;base64,/, "");
      fs.writeFile(file_path, base64Data, 'base64', function(err) {

        var params = {
          images_file: fs.createReadStream(file_path)
        };

        visual_recognition.detectFaces(params,
          function(err, response) {
            if (err){
              console.log(err);
              response = {'message': "Error: "+err};
            }

            res.send(JSON.stringify(response, null, 2));
          });
      });
  }
});

app.post('/visual-analysis/text', function(req, res){
  var snapshot = req.body.img;
  var message = "";

  if (snapshot.length <= 0) {
    message = "Error: No image provided";
    console.log(message);
    res.send(message);
  } else {

    // Create File Name (MD5 of the Base 64 String) + Path (snapshot/tmp_{name})
    var name = crypto.createHash('md5').update(snapshot).digest("hex"),
        file_path = "./snapshot/tmp_"+name+".jpg";
    
    // Write the file to the snapshot directory
    var base64Data = snapshot.replace(/^data:image\/jpeg;base64,/, "");
      fs.writeFile(file_path, base64Data, 'base64', function(err) {

        var params = {
          images_file: fs.createReadStream(file_path)
        };

        visual_recognition.recognizeText(params,
          function(err, response) {
             if (err){
              console.log(err);
              response = {'message': "Error: "+err};
            }

            res.send(JSON.stringify(response, null, 2));
          });
      });
  }
});


app.post('/visual-analysis/emotion', function(req, res){
  var snapshot = req.body.img;
  var message = "";

  if (snapshot.length <= 0) {
    message = "Error: No image provided";
    console.log(message);
    res.send(message);
  } else {

    // Create File Name (MD5 of the Base 64 String) + Path (snapshot/tmp_{name})
    var name = crypto.createHash('md5').update(snapshot).digest("hex"),
        file_path = "./snapshot/tmp_"+name+".jpg";
    
    // Write the file to the snapshot directory
    var base64Data = snapshot.replace(/^data:image\/jpeg;base64,/, "");
      fs.writeFile(file_path, base64Data, 'base64', function(err) {

        var params = {
          images_file: fs.createReadStream(file_path),
          classifier_ids: ['OfficeArt_622256025']
        };

        visual_recognition.classify(params,
          function(err, response) {
             if (err){
              console.log(err);
              response = {'message': "Error: "+err};
            }
            
            res.send(JSON.stringify(response, null, 2));
          });
      });
  }
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
