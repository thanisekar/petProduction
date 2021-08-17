const fedexService = require('../services/FedExService');

const LOG = require('../utils/Logger');

module.exports = (app)=>{
    app.post('/rates',function(httpReq,httpRes){
       LOG.info("===============>POST /shipping/rates - " + JSON.stringify(httpReq.body));
        httpRes.type('application/json'); // set content-type
 
        fedexService.getRates({inputData : httpReq.body,cb : function(err,response){
                if(err){
                    httpRes.json({"status":"failure"});
                }else{
                    httpRes.json(response);
                }
            }
        });
      });
}



/* app.post('/v1/rates',function(httpReq,httpRes){
    logger.debug("===============>POST /shipping/rates - " + JSON.stringify(req.body));
    res.type('application/json'); // set content-type

    let rateReq = validateAndExtractRateReqInfo(httpReq);


    async.parallel([uspsRates,upsRates,fedexRates], function(err, results) {

        res.statusCode = 200;
        res.message = 'OK';	


        // results now equals to: [one: 'abc\n', two: 'xyz\n']
        console.log(results.join('|'))
    });
    
    function extractRateInputInfo(request){

        extractRateInputInfo

    }

    function uspsRates(callback){
        console.log("Hello from abc")
        uspsService.getRates(rateReq,function(){
            if(err){
                
            }

        });

        callback(null, 'abc');
      }

      function upsRates(callback){
        console.log("Hello from abc")
        callback(null, 'abc');
      }

      function fedexRates(callback){
        console.log("Hello from abc")
        callback(null, 'abc');
      }


    res.json({"status":req.body.hello});
  }); */
