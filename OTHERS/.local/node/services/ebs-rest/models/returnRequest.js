var occReturnRequest = require('../lib/occ_returnRequest');

module.exports = function (ReturnRequest) {
    //http://localhost:3000/b2c/api/v1/returnRequests/updatereturnrequest/100003
    ReturnRequest.updateReturnRequest = function (returnRequestNumber, returnRequestUpdatePayload, callback) {
        occReturnRequest.updateReturnRequest(returnRequestNumber, returnRequestUpdatePayload, function (error, result) {
            console.log("Update ReturnRequest call completed....");
            return callback(error, result);
        });
    };

    ReturnRequest.remoteMethod(
        'updateReturnRequest', {
            http: {
                path: '/updatereturnrequest/:returnRequestNumber/',
                verb: 'put'
            },
            accepts: [
                {
                    arg: 'returnRequestNumber',
                    type: 'string',
                    required: true
                },
                {
                    arg: 'returnRequestUpdatePayload',
                    type: 'object',
                    required: true,
                    http: { source: 'body' }
                }
            ],
            returns: {
                type: 'object',
                root: true
            }
        }
    );
}
