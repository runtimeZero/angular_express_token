var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var errorhandler = require('errorhandler');
var conf = require('./conf');
var auth = require('./auth');

/****** server setup + config + middleware *********/
var app = express();

app.use(bodyParser());
app.use(bodyParser.json({type:'application/vnd.api+json'}));
app.use(function(req,res,next){
  console.log('%s %s', req.method, req.url);
  next();
});
app.use(auth.checkToken);
if(process.env.NODE_ENV === 'development'){
  app.use(errorhandler());
}

/*********** start server ************/
http.createServer(app).listen(conf.port,function(){
  console.log('Express server listening on port ' + conf.port);
});


/****** Routes that don't need authorization  *********/
app.get('/route1',function(req,res){
  res.json({key1: "Some data returned from route1"});
});


/****** Routes that require admin level authorization  *********/

app.get('/needAdminLevelInfo',auth.checkForAdmin,function(req,res){
  res.json({key: "This sentence represents some data returned from server route 'needAdminLevelInfo'"});
});

/****** Routes that require user level and above authorization  *********/

app.get('/needUserLevelInfo',auth.checkForUser,function(req,res){
  res.json({key: "This sentence represents some data returned from server route 'needUserLevelInfo'"});
});

app.post('/login',function(req,res,next){

  result = auth.authenticateCredentials(req,res,next);

  if(result !== null){
    token = auth.genToken(result);

    res.json({
      token:token,
      user:result
    });

  }else {
    res.send(401,"Authentication Error");
  }

});


/****** Serving Static pages  *********/
app.use(express.static(__dirname + '/../client'));
