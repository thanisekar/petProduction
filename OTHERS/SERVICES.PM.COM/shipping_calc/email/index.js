'use strict';

var express = require('express');
var bodyParser = require('body-parser');
const LOG = require('../utils/Logger');
var emailService = require('../services/EmailService');

var app = module.exports = new express.Router();

app.use(bodyParser.json());

app.post('/signup',function(req,res){
    LOG.debug("===============>/email/signup - " + JSON.stringify(req.body));
    let result = {};
    res.type('application/json'); // set content-type
    res.statusCode = 200;
    res.message = 'OK';

    if(req.body.emailId){
        emailService.saveEmail({emailId : req.body.emailId},(success)=>{
            if(success){
                result = {"message":"Signed up successfully."};
            }else{
                result = {"error":"There was some error in sign up.Please try again."};
            }
            res.json(result)
        });
     }else{
        res.json({"error":"Email id is required."});
    }
	
});

