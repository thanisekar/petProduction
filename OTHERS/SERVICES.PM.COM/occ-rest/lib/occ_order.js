var occLib = require('../../lib/occ-rest');
var occ_conn = require('../../etc/occ_conn.json');
var occAPI = new occLib(occ_conn);

module.exports = {
    getOrder: function(orderNumber, callback) {
        var lang = { 'x-ccasset-language': 'en' };
        occAPI.get({
            url: '/ccagent/v1/orders/' + orderNumber + '/?includeResult=full', callback: function(err, response) {
                'use strict';
                return callback(err, response);
            }
        });
    }
}