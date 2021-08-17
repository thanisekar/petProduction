var occLib = require('../../lib/occ-rest');
var occ_conn = require('../../etc/occ_conn.json');
var occAPI = new occLib(occ_conn);

module.exports = {
    updateOrder: function (orderNumber, orderUpdatePayload, callback) {
        var lang = { 'x-ccasset-language': 'en' };
        occAPI.put({
            url: '/ccadmin/v1/orders/' + orderNumber, data: orderUpdatePayload, headers: lang, callback: function (err, response) {
                'use strict';
                return callback(err, response);
            }
        });
    },
}