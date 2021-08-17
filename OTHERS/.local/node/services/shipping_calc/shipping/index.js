'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var logger = require('winston');


var app = module.exports = new express.Router();

app.use(bodyParser.urlencoded({limit: '5mb', extended: true}));
app.use(bodyParser.json({limit: '5mb', extended: true}));
//app.use(bodyParser.json());
require('./rates')(app);

