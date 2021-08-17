'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var logger = require('winston');


var app = module.exports = new express.Router();

app.use(bodyParser.json());

app.get('/uthere',function(req,res){
    //logger.debug("===============>POST /shipping - " + JSON.stringify(req.body));
    res.type('application/json'); // set content-type
    res.statusCode = 200;
    res.message = 'OK';	
    res.json({"status":"Shipping calculator is up and running.... and running..."});
    
});


require('./rates')(app);

