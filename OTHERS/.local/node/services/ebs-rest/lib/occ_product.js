var occLib = require('../../lib/occ-rest');
var occ_conn = require('../../etc/occ_conn.json');
var occAPI = new occLib(occ_conn);

module.exports = {

    createProduct: function (productPayload, callback) {
        var lang = { 'x-ccasset-language': 'en' };
        occAPI.post({
            url: '/ccadmin/v1/products', data: productPayload, headers: lang, callback: function (err, response) {
                'use strict';
                return callback(err, response);
            }
        });
    },

    updateProduct: function (id, productPayload, callback) {
        var lang = { 'x-ccasset-language': 'en' };
        occAPI.put({
            url: '/ccadmin/v1/products/' + id, data: productPayload, headers: lang, callback: function (err, response) {
                'use strict';
                return callback(err, response);
            }
        });
    },

    updateProductPrice: function (priceItems, callback) {
        var lang = { 'x-ccasset-language': 'en' };
        occAPI.put({
            url: '/ccadmin/v1/prices/', data: priceItems, headers: lang, callback: function (err, response) {
                'use strict';
                return callback(err, response);
            }
        });
    },
}