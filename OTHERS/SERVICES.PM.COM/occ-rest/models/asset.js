'use strict';

const fs = require('fs');
const occAsset = require('../lib/occ_asset');
const logger = require('../lib/dmc_logger');

module.exports = function (Asset) {

    // remote method to validate assets
    Asset.validateAssets = function(token, req, callback) {

        // call to validate assets
        occAsset.validateAssets(token, function(error, response) {
            if (error) {
                callback(error, null);                        
            }
            callback(null, response);
        });
    }

    Asset.remoteMethod(
        'validateAssets',
        {
            http: {
                path: '/validate/',
                verb: 'post',
            },
            accepts: [
                {
                    arg: 'token',
                    type: 'object',
                    http: { source: 'body' },
                    required: true
                },
                {
                    arg: 'req',
                    type: 'object',
                    http: { source: 'req' }
                }
            ],
            returns: {
                type: 'object',
                root: true
            }
        }
    )

    Asset.importAssets = function (token, req, callback) {

        // call to import assets
        occAsset.importAssets(token, function(error, response) {
            if (error) {
                callback(error, null);  
            }
            callback(null, response);
        });
    }

    Asset.remoteMethod(
        'importAssets',
        {
            http: {
                path: '/import/',
                verb: 'post',
            },
            accepts: [
                {
                    arg: 'token',
                    type: 'object',
                    http: { source: 'body' },
                    required: true
                },
                {
                    arg: 'req',
                    type: 'object',
                    http: { source: 'req' }
                }
            ],
            returns: {
                type: 'object',
                root: true
            }
        }
    )   


    Asset.uploadAssets = function (fileName, payloadData, req, callback) {

        const filePath = __dirname + "/../data/df/" + req.body.fileName;
        fs.exists(filePath, function(exists) {
            
            if (exists) {
                
                // read the file contents
                let data = fs.readFileSync(filePath);
                
                // base64 encoded file data
                let encodedData = new Buffer(data).toString('base64');
                occAsset.uploadAsset(req.body.fileName, encodedData, function(error, res) {
                    if (error) {
                        logger.error('Error in file upload api', error);
                        callback(error, null);
                    }
                    if (res.status === 'SUCCESS') {

                        logger.info('Response from the file upload api', res);

                        // prepare token       
                        const tokenData = {};
                        tokenData['token'] = res.token;
                        
                        // call to validate assets
                        occAsset.validateAssets(tokenData, function(error, response) {
                            if (error) {
                                logger.error('Error in validate asset api', error);
                                callback(error, null);                        
                            }
                            if (response) {
                                
                                logger.info('Response from validate asset api', response);

                                // call to import assets
                                occAsset.importAssets(tokenData, function(error, response) {
                                    if (error) {
                                        logger.error('Error in import asset api', error);
                                        callback(error, null);  
                                    }
                                    if (response) {
                                        logger.info('import complete ', req.body.fileName);
                                        //logger.info('moving the file ', req.body.fileName);
                                                                            
                                        //var source = __dirname + "/../data/df/" + req.body.fileName;
                                        //var destination = __dirname + "/../data/outbound/" + req.body.fileName;

                                        //fs.rename(source, destination); 

                                    }
                                    logger.info('final response', response);
                                    callback(null, response);
                                });
                            }
                        });
                    } else {
                        // when status other than SUCCESS
                        logger.error('Error in file upload api', res);
                        const error = {};
                        error['status'] = res.status;
                        error['message'] = res;
                        callback(error, null);     
                    }            
                });
            } else {
                logger.info('File does not exist');
                const error = {};
                error['status'] = true;
                error['message'] = 'File does not exist';
                callback(error, null);
            }
        })     
    }

    Asset.remoteMethod(
        'uploadAssets',
        {
            http: {
                path: '/upload/',
                verb: 'post',
            },
            accepts: [
                {
                    arg: 'fileName',
                    type: 'string',
                    required: true
                },
                {
                    arg: 'payloadData',
                    type: 'object',
                    http: { source: 'body' },
                    required: true
                },                
                {
                    arg: 'req',
                    type: 'object',
                    http: { source: 'req' }
                }
            ],
            returns: {
                type: 'object',
                root: true
            }
        }
    )     

};