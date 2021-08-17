var FedExAPI = require('node-shipping-fedex');
var moment = require('moment');
var fedexDetails = require('../utils/GlobalData').config.fedexDetails;
const LOG = require('../utils/Logger');

const fedEx = new FedExAPI(fedexDetails.credentials);
const shippingMehodList = fedexDetails.shippingMehodList;
const daysNames = fedexDetails.daysNames;
const successResponses = ["SUCCESS","NOTE","WARNING"];
module.exports = {
    getRates : function(input){
        let details = getDetails(input.inputData);
        let shippingMethodIds = getMethodIds(input.inputData);
        let totalPriceWasZero = false;
        if(details.totalWeight === 0){
          details.totalWeight = 0.01;
          totalPriceWasZero = true;
        }
        if(details.totalWeight > 0 && details.totalWeight <= 150 ){

          fedEx.rates(prepareFedReq(input.inputData,details.totalWeight),function(err, res) {
            if(err) {
              LOG.error("Error in getting shipping rates : "+JSON.stringify(err));
              //return input.cb("error",unknownErrorResponse());
              return input.cb("error",allHardCodedShippingMethods());
            } else{
              if(res){
                if(successResponses.indexOf(res.HighestSeverity.toUpperCase()) > -1 && res.RateReplyDetails){
                  console.log("Success in getting shipping rates : "+JSON.stringify(res));
                  let shipMethods = prepareSuccessResponse(input.inputData,res,shippingMethodIds);
                  if(totalPriceWasZero){
                    let grndShipMthd = {};
                    shipMethods.shippingMethods.forEach(function(sm){
                      
                      if(sm.displayName.indexOf("Ground") > -1){
                        grndShipMthd = sm;
                        //console.log("===="+sm.displayName)
                      }
                    });
                    return input.cb(null,{shippingMethods : [grndShipMthd]});
                  }
                  return input.cb(null,shipMethods);
                }/* else if(res.Notifications && res.Notifications[0].Code === "556"){
                  LOG.error("Error in getting shipping rates : "+JSON.stringify(res));
                    return input.cb(null,prepareErrorResponse());
                } */else{
                  LOG.error("Error in getting shipping rates : "+JSON.stringify(res));
                  //return input.cb("error",prepareErrorResponse(res));
                  return input.cb(null,allHardCodedShippingMethods(shippingMethodIds)); 
                }
              }else{
                LOG.error("Error in getting shipping rates : "+JSON.stringify(res));
                //return input.cb("error",unknownErrorResponse());
                return input.cb(null,allHardCodedShippingMethods(shippingMethodIds));
              }
            }
          });
        } else if(details.totalWeight > 150 && details.isFreeShipping){
          return input.cb(null,onlyGroundShipping(shippingMethodIds,0.0));
        } else {
          return input.cb(null,onlyGroundShipping(shippingMethodIds,5.95));
        }



    }
}

function getMethodIds(inputData){
  let externallyPricedMethodsMap = {};
  let externallyPricedMethods = inputData.availableExternallyPricedShippingMethods;

  if(externallyPricedMethods && externallyPricedMethods.length > 0){
    externallyPricedMethods.forEach(function(mthd){
      externallyPricedMethodsMap[mthd.displayName] = mthd;
    });
  }

  return externallyPricedMethodsMap;

}




function getDetails(inputData){
  let order = inputData.order;
  let totalWeight = 0;
  let isFreeShipping = false;
  if(order){
    //console.log("inside order")
      try{
        order.shoppingCart.items.forEach(function(item){
          let quant = item.quantity;  
          item.skuProperties.forEach(function(prop){
              //console.log(prop.id)
              if("petWeight" === prop.id && prop.value){
                totalWeight +=  quant * Number(prop.value.replace("LB","").trim());
              }
              if("isFreeShipping" === prop.id && prop.value){
                isFreeShipping = true;
              }
            });
        });
    }catch(e){

    }
  }
  console.log("totalWeight : "+totalWeight+", isFreeShipping : "+isFreeShipping);
  return {totalWeight : totalWeight, isFreeShipping : isFreeShipping};
}

function prepareSuccessResponse(inputReq,res,externallyPricedMethodsMap){
  let shippingMethods = [];
  res.RateReplyDetails.forEach((rateDetails) =>{
    if(shippingMehodList[rateDetails.ServiceType]){
     // console.log(JSON.stringify(rateDetails.CommitDetails));
      let shippingCost = (rateDetails.RatedShipmentDetails 
        && rateDetails.RatedShipmentDetails[0]
            && rateDetails.RatedShipmentDetails[0].RatedPackages   
              && rateDetails.RatedShipmentDetails[0].RatedPackages[0]
                && rateDetails.RatedShipmentDetails[0].RatedPackages[0].PackageRateDetail
                  && rateDetails.RatedShipmentDetails[0].RatedPackages[0].PackageRateDetail.NetFedExCharge
                    && rateDetails.RatedShipmentDetails[0].RatedPackages[0].PackageRateDetail.NetFedExCharge.Amount) ? 
                       rateDetails.RatedShipmentDetails[0].RatedPackages[0].PackageRateDetail.NetFedExCharge.Amount : 0.00;
     
      let timeStamp = (rateDetails.CommitDetails && rateDetails.CommitDetails[0] && rateDetails.CommitDetails[0].CommitTimestamp) ?
                          rateDetails.CommitDetails[0].CommitTimestamp : "";
      
      let days  = (rateDetails.TransitTime) ? daysNames[rateDetails.TransitTime.toUpperCase()] : 0;
      //console.log(rateDetails.TransitTime)

      if(timeStamp){
        let temp = moment(timeStamp, "YYYY-MM-DDTHH:mm:ss.sssZ");
        let now = moment();
        //console.log("days -- "+(temp.diff(now,'days')));
        days = temp.diff(now,'days')+1;
        timeStamp =  temp.format('YYYY-MM-DD HH:mm:ss Z');
      } else if(days){
        timeStamp = new moment().add(days, 'day').format('YYYY-MM-DD HH:mm:ss Z');
      }
      
      //Giving 11% discount
      shippingCost = shippingCost - 0.11 * shippingCost;
      
      let shippingMethod = {
        "shippingCost": Number(shippingCost) ,
        "shippingTax": 0,
        "shippingTotal": Number(shippingCost),
        "internationalDutiesTaxesFees": 0,
        "eligibleForProductWithSurcharges": true,
        "deliveryDays": days,
        "estimatedDeliveryDateGuaranteed": false,
        "estimatedDeliveryDate": timeStamp,
        "displayName": shippingMehodList[rateDetails.ServiceType],
        "carrierId": "ON",
        "taxcode": "dummy-tax-code",
        "currency": "USD"
      }
      //console.log(shippingMethod.displayName);
      if(externallyPricedMethodsMap[shippingMethod.displayName]){
        shippingMethod.shippingMethodId = externallyPricedMethodsMap[shippingMethod.displayName].shippingMethodId;
        shippingMethod.id = externallyPricedMethodsMap[shippingMethod.displayName].shippingMethodId;
        shippingMethod.repositoryId = externallyPricedMethodsMap[shippingMethod.displayName].shippingMethodId;
      }
      shippingMethods.push(shippingMethod);
      LOG.debug("Shipping Method : "+rateDetails.ServiceType);
    }
  });
  return {
    shippingMethods : shippingMethods
  }
}
function allHardCodedShippingMethods(externallyPricedMethodsMap){
  return {
      shippingMethods : [
        {
          "shippingCost": 5.95 ,
          "shippingTax": 0,
          "shippingTotal": 5.95,
          "internationalDutiesTaxesFees": 0,
          "eligibleForProductWithSurcharges": true,
          "deliveryDays": 3,
          "estimatedDeliveryDateGuaranteed": false,
          "estimatedDeliveryDate": new moment().add(3, 'day').format('YYYY-MM-DD HH:mm:ss Z'),
          "displayName": "Ground (Standard Shipping: 2 to 5 Business Days)",
          "carrierId": "GND",
          "taxcode": "dummy-tax-code",
          "currency": "USD",
          "shippingMethodId" : externallyPricedMethodsMap["Ground (Standard Shipping: 2 to 5 Business Days)"].shippingMethodId,
          "id" : externallyPricedMethodsMap["Ground (Standard Shipping: 2 to 5 Business Days)"].shippingMethodId,
          "repositoryId" : externallyPricedMethodsMap["Ground (Standard Shipping: 2 to 5 Business Days)"].shippingMethodId
      },
      {
        "shippingCost": 14.99  ,
        "shippingTax": 0,
        "shippingTotal": 14.99 ,
        "internationalDutiesTaxesFees": 0,
        "eligibleForProductWithSurcharges": true,
        "deliveryDays": 2,
        "estimatedDeliveryDateGuaranteed": false,
        "estimatedDeliveryDate": new moment().add(2, 'day').format('YYYY-MM-DD HH:mm:ss Z'),
        "displayName": "2 Day Shipping: Expect Within 2 Business Days",
        "carrierId": "2DY",
        "taxcode": "dummy-tax-code",
        "currency": "USD",
        "shippingMethodId" : externallyPricedMethodsMap["2 Day Shipping: Expect Within 2 Business Days"].shippingMethodId,
        "id" : externallyPricedMethodsMap["2 Day Shipping: Expect Within 2 Business Days"].shippingMethodId,
        "repositoryId" : externallyPricedMethodsMap["2 Day Shipping: Expect Within 2 Business Days"].shippingMethodId
    },
    {
      "shippingCost": 24.95 ,
      "shippingTax": 0,
      "shippingTotal": 24.95,
      "internationalDutiesTaxesFees": 0,
      "eligibleForProductWithSurcharges": true,
      "deliveryDays": 1,
      "estimatedDeliveryDateGuaranteed": false,
      "estimatedDeliveryDate": new moment().add(1, 'day').format('YYYY-MM-DD HH:mm:ss Z'),
      "displayName": "Overnight Shipping: Expect Within 1 Business Day",
      "carrierId": "ONT",
      "taxcode": "dummy-tax-code",
      "currency": "USD",
      "shippingMethodId" : externallyPricedMethodsMap["Overnight Shipping: Expect Within 1 Business Day"].shippingMethodId,
      "id" : externallyPricedMethodsMap["Overnight Shipping: Expect Within 1 Business Day"].shippingMethodId,
      "repositoryId" : externallyPricedMethodsMap["Overnight Shipping: Expect Within 1 Business Day"].shippingMethodId
    }
    ]
  }

 
}

function onlyGroundShipping(externallyPricedMethodsMap,shippingCost){
  let timeStamp = new moment().add(3, 'day').format('YYYY-MM-DD HH:mm:ss Z');
  return {
    shippingMethods : [ {
      "shippingCost": shippingCost ,
      "shippingTax": 0,
      "shippingTotal": shippingCost,
      "internationalDutiesTaxesFees": 0,
      "eligibleForProductWithSurcharges": true,
      "deliveryDays": 3,
      "estimatedDeliveryDateGuaranteed": false,
      "estimatedDeliveryDate": timeStamp,
      "displayName": "Ground (Standard Shipping: 2 to 5 Business Days)",
      "carrierId": "GND",
      "taxcode": "dummy-tax-code",
      "currency": "USD",
      "shippingMethodId" : externallyPricedMethodsMap["Ground (Standard Shipping: 2 to 5 Business Days)"].shippingMethodId,
      "id" : externallyPricedMethodsMap["Ground (Standard Shipping: 2 to 5 Business Days)"].shippingMethodId,
      "repositoryId" : externallyPricedMethodsMap["Ground (Standard Shipping: 2 to 5 Business Days)"].shippingMethodId
    }]
  }

 
}

function prepareErrorResponse(){
  return {
    "errorCode": "00000000",
    "message": "Invalid shipping address",
    "errors": [
      {
        "errorCode": "28128",
        "message": "Please check the shipping address and try again.",
        "status": "500"
      }
    ],
    "status": "500"
  }
}

/* function unknownErrorResponse(){
  return {
      "errorCode": "00000000",
      "message": "There was some unknown error, please contact you admin.",
      "errors": [
        {
          "errorCode": "28128",
          "message": "There was some unknown error, please contact you admin.",
          "status": "400"
        }
      ],
      "status": "400"
    }

} */



function prepareFedReq(inputData,totalWeight){
  //console.log("inside prepareFedReq");
  let address = inputData.request.address;

  let frdReq =  {
    ReturnTransitAndCommit: true,
   // CarrierCodes: ['FDXG'],
    RequestedShipment: {
      //DropoffType: 'REGULAR_PICKUP',
      //ServiceType: 'FEDEX_GROUND',
      //PackagingType: 'FEDEX_BOX',
      Shipper: {
        Address: {
          StreetLines: [
            fedexDetails.shipper.addressLine1
          ],
          City: fedexDetails.shipper.city,
          StateOrProvinceCode: fedexDetails.shipper.state,
          PostalCode: fedexDetails.shipper.postalCode,
          CountryCode: "US"
        }
      },
      Recipient: {
        Address: {
          StreetLines: [
            address.address1
          ],
         // City: address.city,
          StateOrProvinceCode: address.state,
          PostalCode: address.postalCode,
          CountryCode: "US",
          Residential: false
        }
      },
      ShippingChargesPayment: {
        PaymentType: "SENDER",
        Payor: {
          ResponsibleParty: {
            AccountNumber: fedEx.account_number
          }
        }
      },
      PackageCount: "1",
      RequestedPackageLineItems: {
        SequenceNumber: 1,
        GroupPackageCount: 1,
        Weight: {
          Units: "LB",
          Value: String(totalWeight)
        }/* ,
        Dimensions: {
          Length: 108,
          Width: 5,
          Height: 5,
          Units: 'IN'
        } */
      }
    }
  };
  console.log("frdReq "+JSON.stringify(frdReq));
  return frdReq;
}