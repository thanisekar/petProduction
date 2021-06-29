'use strict';

const fs = require('fs');
const occAsset = require('../lib/occ_asset');
const logger = require('../lib/dmc_logger');

module.exports = function(Container) {

    // disable remote methods
    Container.disableRemoteMethodByName('download');
    Container.disableRemoteMethodByName('createContainer');
    Container.disableRemoteMethodByName('destroyContainer');
    Container.disableRemoteMethodByName('downloadStream');
    Container.disableRemoteMethodByName('getContainer');
    Container.disableRemoteMethodByName('getContainers');
    Container.disableRemoteMethodByName('getFile');
    Container.disableRemoteMethodByName('getFiles');
    Container.disableRemoteMethodByName('getContainers');
    Container.disableRemoteMethodByName('removeFile');

    Container.beforeRemote('upload', function(ctx,  modelInstance, next) {
        next();
    });


    Container.afterRemote('upload', function(ctx,  modelInstance, next) {

        const fileName = modelInstance.result.files[""][0].name;
        const filePath = __dirname + "/../data/df/" + fileName;

        logger.info('uploaded filename ' +  fileName);
        logger.info('uploaded path ' + filePath);

        fs.exists(filePath, function(exists) {
            
            if (exists) {
                
                // read the file contents
                let data = fs.readFileSync(filePath);
                
                // base64 encoded file data
                let encodedData = new Buffer(data).toString('base64');
                occAsset.uploadAsset(fileName, encodedData, function(error, res) {
                    if (error) {
                        logger.error('error occured in file upload api ', error);
                        ctx.result = error;                        
                        next();
                    }

                    logger.info('got the response ', res);
                    ctx.result = res;
                    next();
                });
            } else {

                const error = {};
                error['error'] = true;
                error['message'] = 'File does not exist';

                logger.error('error occured in file upload api ', error);
                ctx.result = error;
                next();
            }
        });

    });

};