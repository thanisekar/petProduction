var occLib = require('../../lib/occ-rest');
var occ_conn = require('../../etc/occ_conn.json');
var occAPI = new occLib(occ_conn);

module.exports = {
    getReturnRequest: function (id, callback) {
        var lang = { 'x-ccasset-language': 'en' };
        occAPI.get({
            url: '/ccagent/v1/returnRequests/' + id, callback: function (err, response) {
                'use strict';
                return callback(err, response)
            }
        });
    },

    getReturnRequestByOrder: function (order, callback) {
        console.log("=========================");
        console.log(order);
        var lang = { 'x-ccasset-language': 'en' };
        occAPI.get({
            url: '/ccagent/v1/returnRequests?q=' + order, callback: function (err, response) {
                'use strict';
                return callback(err, response)
            }
        });
    },

    createReturnRequest: function (returnRequestPayload, callback) {
        var lang = {
            "accept": "application/json",
            "content-type": "application/json",
            'x-ccasset-language': 'en'
        }
        var ctype = { 'x-ccasset-language': 'en' };
        payload =
            { "op": "initiateReturn", "orderId": "o10400" }

        occAPI.post({
            url: '/ccagent/v1/returnRequests', data: returnRequestPayload, callback: function (err, response) {
                return callback(err, response);
            }
        });
    }
}