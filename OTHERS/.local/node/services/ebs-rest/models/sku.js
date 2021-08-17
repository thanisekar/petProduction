'use strict';
var occSKU = require('../lib/occ_sku');

module.exports = function (SKU) {

    SKU.createSKU = function (skuPayload, callback) {
        occSKU.createSKU(skuPayload, function (error, result) {
            return callback(error, result);
        });
    };

    SKU.updateSKU = function (sku, skuUpdatePayload, callback) {
        occSKU.updateSKU(sku, skuUpdatePayload, function (error, result) {
            return callback(error, result);
        });
    };

    SKU.remoteMethod(
        'createSKU', {
            http: {
                path: '/createSKU/',
                verb: 'post'
            },
            accepts: [
                {
                    arg: 'skuPayload',
                    type: 'object',
                    required: true,
                    http: { source: 'body' }
                }
            ],
            returns: {
                type: 'object',
                root: true
            }
        }
    );

    SKU.remoteMethod(
        'updateSKU', {
            http: {
                path: '/updateSKU/:SKU/',
                verb: 'put'
            },
            accepts: [
                {
                    arg: 'SKU',
                    type: 'string',
                    required: true
                },
                {
                    arg: 'skuUpdatePayload',
                    type: 'object',
                    required: true,
                    http: { source: 'body' }
                }
            ],
            returns: {
                type: 'object',
                root: true
            }
        }
    );
};
