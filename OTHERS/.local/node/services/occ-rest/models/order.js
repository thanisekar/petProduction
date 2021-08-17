
'use strict';
var occOrder = require('../lib/occ_order');
var submitOrderProcess = require('../lib/dmc_submitOrderProcess');
var authenticate = require("../lib/authenticate");
var app = require('../server/server');

module.exports = function (Order) {

    Order.getOrder = function (orderNumber, email, callback) {
        occOrder.getOrder(orderNumber, function (err, response) {
            if (err) {
                return callback(err, response);
            }
            else {
                if (response.shippingAddress && response.shippingAddress.email === email) {
                    return callback(err, response);
                }
                else {
                    var error = {
                        name: "Invalid Order",
                        message: "Specified order " + orderNumber + " for email " + email + " does not exist",
                        statusCode: 400
                    }
                    return callback(error, null);
                }
            }
        });
    };

    Order.submitOrder = function (orderPayload, req, callback) {
        submitOrderProcess.saveOrder(orderPayload, req, function (err, response) {
            return callback(err, response);
        })
    };


    Order.remoteMethod(
        'getOrder', {
            http: {
                path: '/getOrder/:orderNumber/',
                verb: 'get'
            },
            accepts: [
                {
                    arg: 'orderNumber',
                    type: 'string',
                    required: true
                },
                {
                    arg: 'email',
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

    Order.remoteMethod(
        'submitOrder', {
            http: {
                path: '/submitOrder/',
                verb: 'post',
            },
            accepts: [
                {
                    arg: 'orderPayload',
                    type: 'object',
                    http: { source: 'body' },
                    required: true
                },
                {
                    arg: 'req',
                    type: 'object',
                    http: { source: 'req' }
                }
            ],
            returns: {
                type: 'string',
                root: true
            }
        }
    );

    //                 else {
    //                     next({
    //                         "statusCode": 401,
    //                         "message": "Unauthorized"
    //                     });
    //                 }
    //             });
    //         }
    //         else {
    //             next({
    //                 "statusCode": 401,
    //                 "message": "Unauthorized"
    //             });
    //         }
    //     }
    //     else {
    //         next({
    //             "statusCode": 401,
    //             "message": "Authorization Required"
    //         });
    //     }
    // });

}
