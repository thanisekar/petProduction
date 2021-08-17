var occLib = require('../../lib/occ-rest');
var occ_conn = require('../../etc/occ_conn.json');
var occAPI = new occLib(occ_conn);

module.exports = {
    updateReturnRequest: function (returnRequestNumber, returnRequestUpdatePayload, callback) {
        var lang = { 'x-ccasset-language': 'en' };
        occAPI.put({
            url: '/ccagent/v1/returnRequests/' + returnRequestNumber, data: returnRequestUpdatePayload, headers: lang, callback: function (err, response) {
                'use strict';
                return callback(err, response);
            }
        });
    },
}