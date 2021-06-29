var fs = require('fs');
var json2xml = require('js2xmlparser');
var submitOrderProcessConfig = require('../../etc/submitOrderConfig.json');
var logger = require('../lib/dmc_logger');
var gateway = require("../lib/gateway")

module.exports = {

    saveOrder: function (data, req, callback) {
        if (!data.order || !data.order.id) {
            var error = {
                message: "Invalid Order",
                statusCode: 400
            }
            logger.error("Invalid Order:" + data.order +" | " + data.order.id);
            return callback(error);
        }
        else {
            var orderId = data.order.id;

            let path = submitOrderProcessConfig.dir_occ;
            var stream = gateway.transaction.search(function (search) {
                search.orderId().is(orderId);
            }, function (err, response) {
                response.each(function (err, transaction) {
                    
                    if (typeof transaction.riskData !== 'undefined') {
                        if (transaction.riskData.decision === 'Review' || transaction.riskData.decision === 'Decline') {
                            path = "/.local/node/services/occ-rest/data/inbound/orders/Orders for Review";
                        }
                    }

                    // create files for the order
                    var file_name_json = "OCC-sale-" + orderId + ".json";
                    fs.open(path + '/' + file_name_json, 'w', function (err, fd) {
                        if (!err) {
                            fs.writeFile(fd, JSON.stringify(data));
                        }
                        else{
                            logger.error("POST /api/submitOrder - error opening file (json): " + err);
                        }
                    });

                    var file_name_xml = "OCC-sale-" + orderId + ".xml";
                    fs.open(path + '/' + file_name_xml, 'w', function (err, fd) {
                        if (!err) {
                            fs.writeFile(fd, json2xml.parse("ORDER", data), 'utf-8');
                        }
                        else{
                            logger.error("POST /api/submitOrder - error opening file (json): " + err);
                        }
                    });
                    
                    var file_name_connection = "OCC-sale-" + orderId + ".connection";
                    fs.open(path + '/' + file_name_connection, 'w', function (err, fd) {
                        if (!err) {
                            fs.writeFile(fd, JSON.stringify(req.connection.remoteAddress));
                        }
                        else{
                            logger.error("POST /api/submitOrder - error opening file (connection): " + err);
                        }
                    });

                    var file_name_socket = "OCC-sale-" + orderId + ".socket";
                    fs.open(path + '/' + file_name_socket, 'w', function (err, fd) {
                        if (!err) {
                            fs.writeFile(fd, JSON.stringify(req.socket.remoteAddress || req.connection.socket.remoteAddress));
                        }
                        else{
                            logger.error("POST /api/submitOrder - error opening file (socket): " + err);
                        }
                    });
                    
                    var file_name_body = "OCC-sale-" + orderId + ".body";
                    fs.open(path + '/' + file_name_body, 'w', function (err, fd) {
                        if (!err) {
                            fs.writeFile(fd, JSON.stringify(req.body));
                        }
                        else{
                            logger.error("POST /api/submitOrder - error opening file (body): " + err);
                        }
                    });

                });

            });
            
            var payload = {
                "orderId": orderId,
                "state": "PROCESSING"
            }
            return callback(null, payload);
        }
    }
}
