// require the module
const usps = require('usps-web-tools-node-sdk');
const config = require('../config/config')
// tell it to use your username from the e-mail


var UPSService = {
    getRates : function(req){
        usps.configure({ userID: config.userId });
        usps.rateCalculator.rate(
            rateV4Request,
            function (error, response) {
                if (error) {
                    console.log(error);
                } else {
                    console.log(JSON.stringify(response));
                 }
            }
        );
    },
}


var prepareReq = function(req){

    /* if(){

    } */


    var rateV4Request = {
        revision : "2",
        package :[ {
            service : "PRIORITY",
            firstClassMailType : "",
            zipOrigination : "22201",
            zipDestination : "26301",
            pounds : "8",
            ounces : "2",
            width : req.width ?  req.width : 0,
            length: req.length ?  req.length : 0,
            height: req.height ?  req.height : 0,
            girth : req.height ?  req.height : 0,
            content : {
                contentType :"LIVES",
                contentDescription:"OTHER",
            },
            machinable : "TRUE"
        }]
    };
}


