'use strict';
var occProduct = require('../lib/occ_product');

module.exports = function(Product) {
    // http://localhost:3000/b2c/api/v1/products
    Product.createProduct = function(productPayload, callback) {
        occProduct.createProduct(productPayload, function(error, result) {
            return callback(error, result);
        });
    };

    // http://localhost:443/b2c/api/v1/products/prod10007
    Product.updateProduct = function(productID, productUpdatePayload, callback) {
        occProduct.updateProduct(productID, productUpdatePayload, function(error, result) {
            return callback(error, result);
        });
    };

    Product.updateProductPrice = function(priceItems, callback) {
        // http://localhost:3000/b2c/api/v1/products/updateproductprice
        occProduct.updateProductPrice(priceItems, function(error, response) {
            return callback(error, response);
        });
    };

    Product.remoteMethod(
        'createProduct', {
            http: {
                path: '/createProduct/',
                verb: 'post'
            },
            accepts: [
                {
                    arg: 'Product Payload',
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

    Product.remoteMethod(
        'updateProduct', {
            http: {
                path: '/updateProduct/:productID/',
                verb: 'put'
            },
            accepts: [
                {
                    arg: 'productID',
                    type: 'string',
                    required: true
                },
                {
                    arg: 'productUpdate Payload',
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

    // Product.remoteMethod(
    //     'updateProductPrice', {
    //         http: {
    //             path: '/updateproductprice',
    //             verb: 'put',
    //         },
    //         accepts: [
    //             {
    //                 arg: 'priceItems',
    //                 type: 'object',
    //                 http: { source: 'body' },
    //                 required: true
    //             }
    //         ],
    //         returns: {
    //             type: 'object',
    //             root: true
    //         }
    //     }
    // );
};
