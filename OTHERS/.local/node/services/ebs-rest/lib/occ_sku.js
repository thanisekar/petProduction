var occLib = require('../../lib/occ-rest');
var occ_conn = require('../../etc/occ_conn.json');
var occAPI = new occLib(occ_conn);

module.exports = {
    createSKU: function (skuPayload, callback) {
        var lang = { 'x-ccasset-language': 'en' };
        occAPI.put({
            url: '/ccadmin/v1/skus', data: skuPayload, headers: lang, callback: function (err, response) {
                'use strict';
                return callback(err, response);
            }
        });
    },

    updateSKU: function (sku, skuUpdatePayload, callback) {
        var lang = { 'x-ccasset-language': 'en' };
        occAPI.put({
            url: '/ccadmin/v1/skus/' + sku, data: skuUpdatePayload, headers: lang, callback: function (err, response) {
                'use strict';
                return callback(err, response);
            }
        });
    }
}