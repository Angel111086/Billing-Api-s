const express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var multer = require('multer');
var path = require('path');
const cors = require('cors');
const app = express();
var https = require('https');
var http = require('http');
var fs = require('fs');
var _ = require('underscore');

app.use(express.urlencoded({ extended: true }));

// parse application/json
app.use(express.json());

/* Accept header wiht request */
app.use((req, res, next) => {
  console.log("Auth",req.header("Authorization"));
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization ,Accept');
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Credentials', "true");
  res.header(
      "Access-Control-Allow-Origin",
      "Origin", "x-Requested-With", "Content-Type", "Accept", "Authorization");
  if (req.method === 'OPTIONS') {
      res.header("Access-Control-Allow-Methods", 'PUT,  PATCH, GET, DELETE, POST');
      res.header("HTTP/1.1 200 OK"); 
  }
  next();
})


console.log('Path',path.join(__dirname))
app.use(express.static(path.join(__dirname, '/public')));

const healthcottapi = require('./router/healthcott.router');
app.use('/healthcott', healthcottapi);


const hostname = '192.168.1.1';
const httpPort = 30;
const httpsPort = 4200;

const options = {  

  key: fs.readFileSync('/etc/letsencrypt/live/cerbosys.in/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/cerbosys.in/cert.pem'),

  //key: fs.readFileSync('./pem/hc.key'),
  //cert: fs.readFileSync('./pem/hc.cert'),
  requestCert: false,
  rejectUnauthorized: false
};

const httpServer = http.createServer(app);
const httpsServer = https.createServer(options, app);

app.use((req, res, next) => {
  if(req.protocol === 'http'){
    res.redirect(301, `https://${req.headers.hostname}${req.url}`);
  }
  next();
})


httpsServer.listen(httpsPort ,function () {
  console.log('HealthCott listening on port 4200!');
});

httpServer.listen(httpPort ,function () {
  console.log('HealthCott listening on port 4200!');
});
