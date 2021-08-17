'use strict';
// stand-alone index.js

var https = require('https');
var fs = require('fs');
var winston = require('winston');
var express = require('express');
var cors = require('cors');

var app = express();
var LOG = require('./utils/Logger');
var globalData = require('./utils/GlobalData');
var envDetailsPath = './config/config.json';
var envDetails;



if (process.argv.indexOf("-envDetailsPath") != -1) {
  envDetailsPath = process.argv[process.argv.indexOf("-envDetailsPath") + 1];
}

envDetails = require(envDetailsPath);
globalData.config = envDetails;

var scheduleEmail = require('./utils/EmailScheduler');

var wLogger = new (winston.Logger)({
  levels : {
    eror: 0,
    warning: 1,
    info: 2,
    debug: 3
  },
  transports: [
    new (winston.transports.Console)({ level: globalData.config.logLevel,colorize : true })
]
});

LOG.setLogger(wLogger);

var port = process.env.npm_package_config_port || 9090;

https.createServer({
  key: fs.readFileSync(globalData.config.https.key_location),
  cert: fs.readFileSync(globalData.config.https.cert_location)
}, app).listen(port, function () {
  LOG.info('Listening on port ' + port +'...');
});

//Make it cors enabled
app.use(cors())
app.options('*', cors());

scheduleEmail();

app.use('/shipping',require('./shipping'));
app.use('/admin',require('./admin'));
app.use('/email',require('./email'));

/* 

app.listen(port, function () {
  LOG.info('Listening on port ' + port +'...');
}); */
