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


/****** Routes  *********/
app.get('/route1',function(req,res){
  res.json({key1: "Some data returned from route1"});
});

app.get('/route2',function(req,res){
  res.json({key2: "Some data returned from route2"});
});

app.post('/login',function(req,res){

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
