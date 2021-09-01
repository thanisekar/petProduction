'use strict';

var express = require('express');
var bodyParser = require('body-parser');
const LOG = require('../utils/Logger');
var BackInStock = require('../services/BackInStock');

var app = module.exports = new express.Router();

app.use(bodyParser.json());

app.post('/instock',function(req,res){
    LOG.debug("===============>/email/signup - " + JSON.stringify(req.body));
    let result = {};
    res.type('application/json'); // set content-type
    res.statusCode = 200;
    res.message = 'OK';

    if(req.body.emailId){
        BackInStock.saveEmail({emailId : req.body.emailId,item : req.body.item},(success)=>{
            if(success){
                result = {"message":"Back In Stock Item Saved Successfully"};
            }else{
                result = {"error":"There was some error in sign up.Please try again."};
            }
            res.json(result)
        });
     }else{
        res.json({"error":"Email id is required."});
    }
	
});

