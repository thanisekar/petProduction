'use strict';

var express = require('express');
var bodyParser = require('body-parser');
const LOG = require('../utils/Logger');
var gammaService = require('../services/gammaService');

var app = module.exports = new express.Router();

app.use(bodyParser.json());

    app.post('/gammaUser',function(httpReq,httpRes){
        //LOG.info("===============>POST /shipping/rates - " + JSON.stringify(httpReq.body));
         httpRes.type('application/json'); // set content-type
  
         gammaService.gammaData({inputData : httpReq.body,cb : function(err,response){
             console.log(' indexresponse',response);
             console.log(' err',err);
                 if(err){
                     httpRes.json({"status":"failure"});
                 }else{
                     httpRes.json(response);
                 }
             }
         });
       });


