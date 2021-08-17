'use strict';
var occOrder = require('../lib/occ_order');

module.exports = function (Order) {
    Order.updateOrder = function (orderNumber, orderUpdatePayload, callback) {
        // http://localhost:3000/b2c/api/v1/orders/updateorder/o130505
        occOrder.updateOrder(orderNumber, orderUpdatePayload, function (error, response) {
            return callback(error, response);
        });
    };

    Order.remoteMethod(
        'updateOrder', {
            http: {
                path: '/updateorder/:orderNumber/',
                verb: 'put',
            },
            accepts: [
                {
                    arg: 'orderNumber',
                    type: 'string',
                    required: true
                },
                {
                    arg: 'orderUpdatePayload',
                    type: 'object',
                    http: { source: 'body' },
                    required: true
                }
            ],
            returns: {
                type: 'object',
                root: true
            }
        }
    );
};
