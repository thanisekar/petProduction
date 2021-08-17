var occLib = require('../../lib/occ-rest');
var occ_conn = require('../../etc/occ_conn.json');
var logger = require('../lib/dmc_logger');
var occAPI = new occLib(occ_conn);

module.exports = {
    uploadAsset: function (fileName, fileData, callback) {
        var lang = {
            "accept": "application/json",
            "content-type": "application/json"
        }

        let uploadData = {};
        uploadData['filename'] = fileName;
        uploadData['file'] = fileData;

        logger.info('calling the upload asset api');
        // with ', uploadData);
        occAPI.post({
            url: '/ccadmin/v1/asset/upload', data: uploadData, headers: lang, callback: function (err, response) {
                return callback(err, response);
            }
        });
    },


    validateAssets: function(token, callback) {
        var lang = {
            "content-type": "application/json"
        }

        logger.info('calling the validate asset api with');
        // ', token);
        occAPI.post({
            url: '/ccadmin/v1/asset/validate', data: token, headers: lang, callback: function (err, response) {
                return callback(err, response);
            }
        });
    },

    importAssets: function(token, callback) {
        var lang = {
            "content-type": "application/json"
        }

        logger.info('calling the import asset api with');
        // ', token);
        occAPI.post({
            url: '/ccadmin/v1/asset/import', data: token, headers: lang, callback: function (err, response) {
                return callback(err, response);
            }
        });
    }   

}