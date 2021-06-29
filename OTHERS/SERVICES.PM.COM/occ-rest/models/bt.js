'use strict';
var gateway = require("../lib/gateway")
var authenticate = require("../lib/authenticate");
var logger = require('../lib/dmc_logger');
module.exports = function (bt) {

  //Get client Token

  bt.getToken = function (callback) {
    var ct;
    gateway.clientToken.generate({}, function (err, response) {
      ct = response.clientToken;
      console.log('client token is- ' + ct)
      callback(null, {clientToken: ct});
    });
  }

  //Void a transaction

  bt.void = function (transactionId, callback) {
  logger.info('void trigger');
    gateway.transaction.void(transactionId, function (err, response) {

      if (err) {
        return callback(err, response);
      }
      else {
        return callback(null, response);
      }
    });

  }
  
  bt.submitForSettlement = function ( transactionId, transactionAmount,  callback) {
  logger.info('submitForSettlement trigger');
    gateway.transaction.submitForSettlement(transactionId, transactionAmount, function (err, result) {
      if(err){
          callback(err);
          logger.error('submitForSettlement Error',err);
      }else{
        callback(null,result);
        logger.info('submitForSettlement result',result);
      }
      if (result.success) {
        var settledTransaction = result.transaction;
      } else {
      }
    });

  }
  
  bt.submitForPartialSettlement = function ( transactionId, transactionAmount,  callback) {
   logger.info('submitForPartialSettlement trigger');
    gateway.transaction.submitForPartialSettlement(transactionId, transactionAmount, function (err, result) {
      if(err){
          callback(err);
          logger.error('submitForPartialSettlement Error',err);
      }else{
        callback(null,result);
        logger.info('submitForPartialSettlement result',result);
      }
      if (result.success) {
        var settledTransaction = result.transaction;
      } else {
      }
    });

  }
  bt.submitForRefund = function ( transactionId, transactionAmount,  callback) {
   logger.info('submitForRefund trigger');
    gateway.transaction.refund(transactionId, transactionAmount, function (err, result) {
      if(err){
          callback(err);
          logger.error('submitForRefund Error',err);
      }else{
        callback(null,result);
        logger.info('submitForRefund result',result);
      }
    });

  }
  
  
bt.submitForClone = function (transactionId, transactionAmount, callback) {
logger.info('submitForClone trigger');
	gateway.transaction.cloneTransaction(transactionId, {
		amount: transactionAmount,
		options: {
			submitForSettlement: true
		}
	}, function (err, result) {
		if (err) {
			callback(err);
			logger.error('submitForClone Error', err);
		} else {
			callback(null, result);
			logger.info('submitForClone result', result);
		}

	});
}



bt.submitForCloneNoSettle = function (transactionId, transactionAmount, callback) {
logger.info('submitForCloneNoSettle trigger');
	gateway.transaction.cloneTransaction(transactionId, {
		amount: transactionAmount,

		options: {
			submitForSettlement: false
		}
	}, function (err, result) {
		if (err) {
			callback(err);
			logger.error('submitForCloneNoSettle Error', err);
		} else {
			callback(null, result);
			logger.info('submitForCloneNoSettle result', result);
		}

	});
}



bt.submitForSearch = function (transactionIds,callback) {
logger.info('submitForSearch trigger');
	gateway.transaction.search(function (search) {search.id().is(transactionIds);}, function (err, response) {
		  response.each(function (err, transaction) {
                     logger.error('submitForSearch Error', err);
                     logger.info('submitForSearch transaction', transaction);		
                     callback(null,transaction);
		  });
		});
}

bt.submitForSale = function (cvv, expirationDate, number, countryCodeAlpha2, postalCode, region, locality, extendedAddress, streetAddress, lastNameBilling, firstNameBilling, lastNameCustomer, 
firstNameCustomer, oapforderid, ebscustomerid, purchaseOrderNumber, orderId, amount, callback) {
logger.info('submitForSale trigger');
	gateway.transaction.sale({
				  amount: amount,
				  orderId: orderId,
				  purchaseOrderNumber: purchaseOrderNumber,
				  customFields: {
					ebscustomerid: ebscustomerid,
					oapforderid: oapforderid
				  },
				    customer: {
					firstName: firstNameCustomer,
					lastName: lastNameCustomer
				  },
				  billing: {
					firstName: firstNameBilling,
					lastName: lastNameBilling,
					streetAddress: streetAddress,
					extendedAddress: extendedAddress,
					locality: locality,
					region: region,
					postalCode: postalCode,
					countryCodeAlpha2: countryCodeAlpha2
				  },
				  creditCard: {
					 number: number,
					 expirationDate: expirationDate,
				     cvv: cvv,
				  },				  
				  options: {
					submitForSettlement: false
				  }
				}, function (err, result) {
					if (err) {
						callback(err);
						logger.error('submitForSale Error', err);
					} else {
						callback(null, result);
						logger.info('submitForSale result', result);
					}
					if (result.success) {
						result.transaction.customFields;
					  } 

				});
}

  function formatErrors(errors) {
    var formattedErrors = '';

    for (var i in errors) { // eslint-disable-line no-inner-declarations, vars-on-top
      if (errors.hasOwnProperty(i)) {
        formattedErrors += 'Error: ' + errors[i].code + ': ' + errors[i].message + '\n';
      }
    }
    return formattedErrors;
  }

// Authorize a transaction

  bt.btPayment = function (orderPayload, req, callback) {
 logger.info('btPayment trigger');
    console.log('req method = ' + req.method);
    console.log('order payload = ' + JSON.stringify(orderPayload))
    console.log("============= BODY RECEIVED ===============================");
    console.log('req body = ' + JSON.stringify(req.body));
    console.log('CURRENT DIR: ' + __dirname);

    var signature = req.body['x-oracle-cc-webhook-signature'] || req.headers['x-oracle-cc-webhook-signature'];
    console.log('Signature ' + signature);
    // PLEASE USE THIS CODE ALONG WITH YOUR AUTHENTICATION REQUIREMENTS INLINE WTIH OTHER LOOPBACK MODULES
    /*var isValid = authenticate.verifySignature(req.body, signature);
     console.log(isValid);
     if(isValid){
     console.log("Not Authenticated")
     throw "Not Authenticated")
     }*/

    // Constuct the response details that need to be sent through callback
    var responseDetails = {};
    responseDetails["orderId"] = req.body.orderId;
    responseDetails["paymentId"] = req.body.paymentId;
    responseDetails["hostTransactionId"] = req.body.transactionId;
    responseDetails["transactionTimestamp"] = req.body.transactionTimestamp;
    responseDetails["hostTimestamp"] = req.body.transactionTimestamp;
    responseDetails["transactionType"] = req.body.transactionType;
    responseDetails["amount"] = req.body.amount;
    responseDetails["currencyCode"] = req.body.currencyCode;

    // when the received value is null for a specific attribute from bt server, send the attribute value as NOVALUE

    var checkNull = function (object) {
      if (object) {

        return object;
      } else {
        return "#NOVALUE#";
      }
    }

    var additionalProp = {};
    var resp = {};

    if (req.body.transactionType === "0800") {

      var getToken = function (callback) {


        var ct;
        gateway.clientToken.generate({}, function (err, response) {
          ct = response.clientToken;

          if (err) {
            callback(err, response);

          } else
            callback(null, {clientToken: ct});

        });
      }

      var setResponse = function (err, data) {

        if (err) {

          rep["success"] = false;
          resp["description"] = "Transaction Failed";
          resp["reason"] = "Failed";

        } else {
          additionalProp["clientToken"] = checkNull(data.clientToken);

          resp["success"] = true;
          resp["code"] = "1000";
          resp["description"] = "Transaction Successful";
          resp["merchantTransactionId"] = "1234";
          resp["reason"] = "Success";
          resp["additionalProperties"] = additionalProp;

        }

        responseDetails["response"] = resp;
        console.log("800 responseDetails " + JSON.stringify(responseDetails))

        //IF ClientToken is needed from the 800 call uncomment the below code. Currently it is delivered via an AJAX call.
        //callback(null,responseDetails);

      }

      getToken(setResponse);


    }

    else if (req.body.transactionType === "0100") {

      var authorization = function (transaction, callback) {
        console.log("transaction object that will be send to BT server - " + JSON.stringify(transaction))

        //Authorize the bt transaction

        gateway.transaction.sale(transaction, function (err, response) {

          console.log(" Response object received from BT erver after authroizing the transaction -  " + JSON.stringify(response) + " error - " + err);

          if (err) {
            return callback(err, response);
          }
          else {
            console.log(' invoking the callback after authorizing the BT transactions without any errors');
            return callback(null, response);
          }
        });

      }

      var ccPaymentAuthCb = function (error, data) {

        console.log(" Response from BT server  before invoking callback for credit card authorization - " + JSON.stringify(data));

        var customPaymentProp = ["btTransactionStatus", "btCurrencyISOCode", "btAmount", "last4", "cardType", "cardholderName", "expirationDate", "paymentInstrumentType"];

        if (data.success) {

          resp["success"] = true;
          resp["code"] = "1000";
          resp["description"] = "Transaction Successful";
          resp["reason"] = "Success";


          additionalProp["authCode"] = checkNull(data.transaction.processorAuthorizationCode);
          additionalProp["btTransactionId"] = checkNull(data.transaction.id);
          additionalProp["btType"] = checkNull(data.transaction.type);
          additionalProp["btMerchantAccountId"] = checkNull(data.transaction.merchantAccountId);
          additionalProp["btOrderId"] = checkNull(data.transaction.orderId);
          additionalProp["btTransactionStatus"] = checkNull(data.transaction.status);
          additionalProp["btCurrencyISOCode"] = checkNull(data.transaction.currencyIsoCode);
          additionalProp["btAmount"] = checkNull(data.transaction.amount);

          additionalProp["gatewayRejectionReason"] = checkNull(data.transaction.gatewayRejectionReason);
          additionalProp["processorAuthorizationCode"] = checkNull(data.transaction.processorAuthorizationCode);
          additionalProp["processorResponseCode"] = checkNull(data.transaction.processorResponseCode);
          additionalProp["processorResponseText"] = checkNull(data.transaction.processorResponseText);

          additionalProp["token"] = checkNull(data.transaction.creditCard.token);
          additionalProp["last4"] = checkNull(data.transaction.creditCard.last4);
          additionalProp["cardType"] = checkNull(data.transaction.creditCard.cardType);
          additionalProp["cardholderName"] = checkNull(data.transaction.creditCard.cardholderName);
          additionalProp["expirationDate"] = checkNull(data.transaction.creditCard.expirationDate);
          additionalProp["paymentInstrumentType"] = "CreditCard";

          responseDetails["merchantTransactionId"] = checkNull(data.transaction.id);
          responseDetails["additionalProperties"] = additionalProp;
          responseDetails["externalProperties"] = customPaymentProp;

        } else {
          var transactionErrors = data.errors.deepErrors();
          resp["success"] = false;
          resp["code"] = "1000";
          resp["description"] = formatErrors(transactionErrors);
          resp["reason"] = formatErrors(transactionErrors);
        }

        responseDetails["response"] = resp;

        console.log(" Response object details set from BT server creditcard authorization process and before invoking callback of payment transaction completion -  " + JSON.stringify(responseDetails));
        callback(null, responseDetails);


      }

      var paypalPaymentAuthCb = function (error, data) {

        console.log(" Response from BT server  before invoking callback for paypal authorization - " + JSON.stringify(data));


        var customPaymentProp = ["btTransactionStatus", "btCurrencyISOCode", "btAmount",
          "payerEmail",
          "payerFirstName", "payerLastName", "description", "paymentInstrumentType"];


        if (data.success) {

          resp["success"] = true;
          resp["code"] = "1000";
          resp["description"] = "Transaction Successful";
          resp["reason"] = "Success";

          additionalProp["authCode"] = checkNull(data.transaction.id);
          additionalProp["btTransactionId"] = checkNull(data.transaction.id);
          additionalProp["btTransactionStatus"] = checkNull(data.transaction.status);
          additionalProp["btType"] = checkNull(data.transaction.type);
          additionalProp["btCurrencyISOCode"] = checkNull(data.transaction.currencyIsoCode);
          additionalProp["btAmount"] = checkNull(data.transaction.amount);
          additionalProp["btMerchantAccountId"] = checkNull(data.transaction.merchantAccountId);
          additionalProp["payerEmail"] = checkNull(data.transaction.paypal.payerEmail);
          additionalProp["btOrderId"] = checkNull(data.transaction.orderId);
          additionalProp["paymentId"] = checkNull(data.transaction.paypal.paymentId);
          additionalProp["authorizationId"] = checkNull(data.transaction.paypal.authorizationId);
          additionalProp["payerId"] = checkNull(data.transaction.paypal.payerId);
          additionalProp["payerFirstName"] = checkNull(data.transaction.paypal.payerFirstName);
          additionalProp["payerLastName"] = checkNull(data.transaction.paypal.payerLastName);
          additionalProp["description"] = checkNull(data.transaction.paypal.description);
          additionalProp["paymentInstrumentType"] = checkNull(data.transaction.paymentInstrumentType);

          responseDetails["merchantTransactionId"] = checkNull(data.transaction.id);
          responseDetails["additionalProperties"] = additionalProp;
          responseDetails["externalProperties"] = customPaymentProp;

        } else {
          var transactionErrors = data.errors.deepErrors();
          resp["success"] = false;
          resp["code"] = "1000";
          resp["description"] = formatErrors(transactionErrors);
          resp["reason"] = formatErrors(transactionErrors);
        }

        responseDetails["response"] = resp;

        console.log(" Response object details set from BT server paypal authorization process and before invoking callback of payment transaction completion -  " + JSON.stringify(responseDetails));

        callback(null, responseDetails);


      }

      // Populating the transaction object for invoking the calls to BT server

      var trx = {};

      trx["amount"] = req.body.amount / 100;
      trx["paymentMethodNonce"] = req.body.customProperties.nonce;
      trx["orderId"] = req.body.orderId;
      console.log("Merchant Account Id " + "Petmate_instant");
      trx["merchantAccountId"] = "Petmate_instant";
      trx["paymentMethodNonce"] = req.body.customProperties.nonce;
      trx["deviceData"]=req.body.customProperties.deviceData;
      
      var customer = {};
      customer["email"]=req.body.profile.email;
      customer["firstName"]=req.body.billingAddress.firstName;
      customer["lastName"]=req.body.billingAddress.lastName;
      trx["customer"]=customer;

      var cardInfo = {};
      cardInfo["cardholderName"] = req.body.billingAddress.firstName + " " + req.body.billingAddress.lastName;

      trx["creditCard"] = cardInfo;

      var billing = {};

      billing["company"] = req.body.billingAddress.companyName;
      billing["countryCodeAlpha2"] = req.body.billingAddress.country;
      billing["extendedAddress"] = req.body.billingAddress.address2 + " " + req.body.billingAddress.address3;
      billing["firstName"] = req.body.billingAddress.firstName;
      billing["lastName"] = req.body.billingAddress.lastName;
      billing["locality"] = req.body.billingAddress.city;
      billing["postalCode"] = req.body.billingAddress.postalCode;
      billing["region"] = req.body.billingAddress.state;
      billing["streetAddress"] = req.body.billingAddress.address1;

      trx["billing"] = billing;

      var shipping = {};

      shipping["company"] = req.body.shippingAddress[0].companyName;
      shipping["countryCodeAlpha2"] = req.body.shippingAddress[0].country;
      shipping["extendedAddress"] = req.body.shippingAddress[0].address2 + " " + req.body.shippingAddress[0].address3;
      shipping["firstName"] = req.body.shippingAddress[0].firstName;
      shipping["lastName"] = req.body.shippingAddress[0].lastName;
      shipping["locality"] = req.body.shippingAddress[0].city;
      shipping["postalCode"] = req.body.shippingAddress[0].postalCode;
      shipping["region"] = req.body.shippingAddress[0].state;
      shipping["streetAddress"] = req.body.shippingAddress[0].address1;

      trx["shipping"] = shipping;

      var customFields = {};

      customFields["customFieldOne"] = req.body.transactionId;
      customFields["customFieldTwo"] = req.body.profile.email;
      customFields["customFieldThree"] = req.body.phoneNumber;
      customFields["customFieldFour"] = req.body.transactionId;

      var options = {};
      options["submitForSettlement"] = false;
      options["storeInVault"] = false;
      options["storeInVaultOnSuccess"] = false;

      if (req.body.customProperties.type === 'PayPalAccount') {

        var paypal = {};
        paypal["custom_field"] = req.body.orderId;
        //options["paypal"] = paypal;

      }

      trx["options"] = options;

      console.log(" Transaction object created for invoking sale transaction on BT server - " + JSON.stringify(trx));

      // Invoking the sale transaction on BT server

      if (req.body.customProperties.type === 'PayPalAccount') {
        console.log(' EXECUTING BT PAYPAL AUTHORIZATION' + req.body.customProperties.type);

        authorization(trx, paypalPaymentAuthCb);
      } else {
        console.log('INVOKING CREDITCARD AUTHORIZATION');
        authorization(trx, ccPaymentAuthCb);
      }
    }


  };


  bt.remoteMethod(
    'getToken', {
      http: {
        path: '/getToken',
        verb: 'get',
      },
      accepts: [],
      returns: {
        arg: 'clientToken',
        type: 'object',
        root: true
      }
    }
  );

  bt.remoteMethod(
    'void', {
      http: {
        path: '/void/',
        verb: 'post'
      },
      accepts: [
        {
          arg: 'transactionId',
          type: 'string',
          http: {source: 'body'}
        }

      ],
      returns: {
        arg: 'transaction',
        type: 'object',
        root: true
      }
    }
  );
  
      bt.remoteMethod(
    'submitForSearch', {
      http: {
        path: '/submitForSearch/',
        verb: 'post'
      },
       accepts: [
                {
                    arg: 'transactionIds',
                    type: 'string',
                    required: true
                }
              ],
                returns: {
                  type: 'object',
                  root: true
              }
    }
  );

  bt.remoteMethod(
    'submitForSettlement', {
      http: {
        path: '/submitForSettlement/',
        verb: 'post'
      },
       accepts: [
                {
                    arg: 'transactionId',
                    type: 'string',
                    required: true
                },
                {
                    arg: 'transactionAmount',
                    type: 'number',
                    required: true
                }
              ],
                returns: {
                  type: 'object',
                  root: true
              }
    }
  );
  
  bt.remoteMethod(
    'submitForPartialSettlement', {
      http: {
        path: '/submitForPartialSettlement/',
        verb: 'post'
      },
       accepts: [
                {
                    arg: 'transactionId',
                    type: 'string',
                    required: true
                },
                {
                    arg: 'transactionAmount',
                    type: 'number',
                    required: true
                }
              ],
                returns: {
                  type: 'object',
                  root: true
              }
    }
  );
  

  bt.remoteMethod(
    'submitForRefund', {
      http: {
        path: '/submitForRefund/',
        verb: 'post'
      },
       accepts: [
                {
                    arg: 'transactionId',
                    type: 'string',
                    required: true
                },
                {
                    arg: 'transactionAmount',
                    type: 'number',
                    required: true
                }
              ],
                returns: {
                  type: 'object',
                  root: true
              }
    }
  );
  
  bt.remoteMethod(
    'submitForClone', {
      http: {
        path: '/submitForClone/',
        verb: 'post'
      },
       accepts: [
                {
                    arg: 'transactionId',
                    type: 'string',
                    required: true
                },
                {
                    arg: 'transactionAmount',
                    type: 'number',
                    required: true
                }
              ],
                returns: {
                  type: 'object',
                  root: true
              }
    }
  );
  
  
  
  
   bt.remoteMethod(
    'submitForCloneNoSettle', {
      http: {
        path: '/submitForCloneNoSettle/',
        verb: 'post'
      },
       accepts: [
                {
                    arg: 'transactionId',
                    type: 'string',
                    required: true
                },
                {
                    arg: 'transactionAmount',
                    type: 'number',
                    required: true
                }
              ],
                returns: {
                  type: 'object',
                  root: true
              }
    }
  );
  
  

  
  bt.remoteMethod(
    'submitForSale', {
      http: {
        path: '/submitForSale/',
        verb: 'post'
      },
       accepts: [
	            {
                    arg: 'cvv',
                    type: 'string',
                    required: true
                },
	            {
                    arg: 'expirationDate',
                    type: 'string',
                    required: true
                },
				{
                    arg: 'number',
                    type: 'number',
                    required: true
                },
				{
                    arg: 'countryCodeAlpha2',
                    type: 'string',
                    required: true
                },
				{
                    arg: 'postalCode',
                    type: 'string',
                    required: true
                },
				{
                    arg: 'region',
                    type: 'string',
                    required: true
                },
				{
                    arg: 'locality',
                    type: 'string',
                    required: true
                },
				{
                    arg: 'extendedAddress',
                    type: 'string',
                    required: false
                },
				{
                    arg: 'streetAddress',
                    type: 'string',
                    required: true
                },
				{
                    arg: 'lastNameBilling',
                    type: 'string',
                    required: true
                },
				{
                    arg: 'firstNameBilling',
                    type: 'string',
                    required: true
                },
				{
                    arg: 'lastNameCustomer',
                    type: 'string',
                    required: true
                },
				{
                    arg: 'firstNameCustomer',
                    type: 'string',
                    required: true
                },
				{
                    arg: 'ebscustomerid',
                    type: 'string',
                    required: true
                },
				{
                    arg: 'oapforderid',
                    type: 'string',
                    required: true
                },
				{
                    arg: 'purchaseOrderNumber',
                    type: 'number',
                    required: true
                },
				{
                    arg: 'orderId',
                    type: 'string',
                    required: true
                },
                {
                    arg: 'amount',
                    type: 'number',
                    required: true
                }
              ],
                returns: {
                  type: 'object',
                  root: true
              }
    }
  );

  bt.remoteMethod(
    'btPayment', {
      http: {
        path: '/btPayment/',
        verb: 'post',
      },
      accepts: [
        {
          arg: 'orderPayload',
          type: 'object',
          http: {source: 'body'},
          required: true
        },
        {
          arg: 'req',
          type: 'object',
          http: {source: 'req'}
        }
      ],
      returns: {
        type: 'string',
        root: true
      }
    }
  );


};
