var occReturnRequest = require('../lib/occ_returnRequest');
var occagentuirest = require('../../lib/occ-agentui-rest');
var returnRequestProcess = require('../lib/dmc_returnRequestProcess');
var config = require('../../etc/returnRequestConfig.json');

module.exports = function(ReturnRequest) {
    //https://localhost:443/b2c/api/v1/returnRequests/getreturnrequest/100003
    ReturnRequest.getReturnRequest = function(returnRequestNumber, callback) {
        occReturnRequest.getReturnRequest(returnRequestNumber, function(error, result) {
            return callback(error, result);
        });
    };

    //https://localhost/b2c/api/v1/returnRequests/getreturnrequest?orderId=o163278
    ReturnRequest.getReturnRequestByOrder = function(orderNumber, callback) {
        var data = config.query;
        data.orderId = orderNumber;
        occReturnRequest.getReturnRequestByOrder(JSON.stringify(data), function(error, result) {
            return callback(error, result);
        });
    };

    // http://localhost:3000/b2c/api/v1/returnRequests/initiatereturnrequest
    ReturnRequest.createreturnrequest = function(returnRequestPayLoad, req, callback) {
        if (!returnRequestPayLoad.returnRequest || !returnRequestPayLoad.returnRequest.orderId) {
            var error = {
                message: "Invalid Order Id",
                statusCode: 400
            }
            return callback(error);
        }
        var orderId = returnRequestPayLoad.returnRequest.orderId;
        var inputItemList = returnRequestPayLoad.returnRequest.returnItemsList;
        var initiatePayLoad = { "op": "initiateReturn", "orderId": orderId };
        occReturnRequest.createReturnRequest(initiatePayLoad, function(error, result) {
            if (error) {
                return callback(error, result);
            }
            else {
                var returnItemsList = [];
                for (var i = 0; i < inputItemList.length; i++) {
                    var payloadItem = (result.returnItems.filter(function(item) { return item.catRefId == inputItemList[i].catRefId; }))[0];
                    if (payloadItem) {
                        payloadItem.quantityToReturn = parseInt(inputItemList[i].quantityToReturn);
                        payloadItem.returnReason = inputItemList[i].returnReason;
                        returnItemsList.push(payloadItem)
                    }
                }

                var returnItems = [];
                for (var i = 0; i < returnItemsList.length; i++) {
                    var returnItem = {};
                    returnItem.catRefId = returnItemsList[i].catRefId;
                    returnItem.commerceItemId = returnItemsList[i].commerceItemId;
                    returnItem.quantityToReturn = returnItemsList[i].quantityToReturn;
                    returnItem.returnReason = returnItemsList[i].returnReason;
                    returnItem.shippingGroupId = returnItemsList[i].shippingGroup.shippingGroupId;
                    returnItems.push(returnItem);
                }

                var createPayLoad = {
                    "op": "createReturnRequest",
                    "orderId": orderId,
                    "returnItems": returnItems
                }

                var returnRequestUrl = "/v1/returnRequests/";
                occagentuirest.post(returnRequestUrl, createPayLoad, function(error, response) {
                    if (error) {
                        return callback(error, response);
                    }
                    else {
                        returnRequestId = response.returnRequestId;
                        occReturnRequest.getReturnRequest(returnRequestId, function(error, response) {
                            if (error) {
                                return callback(error, response);
                            }
                            else {
                                returnRequestProcess.SaveReturnRequest(returnRequestId, req, response);
                                return callback(error, response);
                            }
                        });
                    }
                });
            }
        });
    };

    ReturnRequest.remoteMethod(
        'getReturnRequest', {
            http: {
                path: '/getReturnRequest/:returnRequestNumber',
                verb: 'get'
            },
            accepts:
            {
                arg: 'returnRequestNumber',
                type: 'string',
                required: true,
            },
            returns: {
                type: 'object',
                root: true
            }
        }
    );

    ReturnRequest.remoteMethod(
        'getReturnRequestByOrder', {
            http: {
                path: '/getReturnRequests/:orderNumber',
                verb: 'get'
            },
            accepts: [
                {
                    arg: 'orderNumber',
                    type: 'string',
                    required: true,
                }
            ],
            returns: {
                type: 'object',
                root: true
            }
        }
    );

    ReturnRequest.remoteMethod(
        'createreturnrequest', {
            http: {
                path: '/createReturnRequest/',
                verb: 'post'
            },
            accepts: [
                {
                    arg: 'returnRequestPayload',
                    type: 'object',
                    required: true,
                    http: { source: 'body' }
                },
                {
                    arg: 'req',
                    type: 'object',
                    http: { source: 'req' }
                }
            ],
            returns: {
                type: 'object',
                root: true
            }
        }
    );
}

