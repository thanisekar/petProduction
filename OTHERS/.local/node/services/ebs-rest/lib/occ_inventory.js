var occLib = require('../../lib/occ-rest');
var occ_conn = require('../../etc/occ_conn.json');
var occAPI = new occLib(occ_conn);

module.exports = {

    updateInventory: function (sku, inventoryUpdatePayload, callback) {
        var lang = { 'x-ccasset-language': 'en' };
        occAPI.put({
            url: '/ccadmin/v1/inventories/' + sku, data: inventoryUpdatePayload, headers: lang, callback: function (err, response) {
                'use strict';
                return callback(err, response);
            }
        });
    },

    createInventory: function (inventoryPayload, callback) {
        var lang = { 'x-ccasset-language': 'en' };
        occAPI.post({
            url: '/ccadmin/v1/inventories', data: inventoryPayload, headers: lang, callback: function (err, response) {
                'use strict';
                return callback(err, response);
            }
        });
    }
}