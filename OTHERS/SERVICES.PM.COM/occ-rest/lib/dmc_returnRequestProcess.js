var returnRequestConfig = require('../../etc/returnRequestConfig');
var json2xml = require('js2xmlparser');
var fs = require("fs");

module.exports = {
    SaveReturnRequest: function (returnRequestId, req, data) {
        var headers_txt = "OCC-return-" + returnRequestId + ".txt";
        fs.open(returnRequestConfig.dir_occ + '/' + headers_txt, 'w', function (err, fd) {
            if (err) {
                 throw "Error opening file " + returnRequestConfig.dir_occ + '/' + headers_txt + " : " + err;
            }
            else {
                fs.writeFile(fd, JSON.stringify(req.headers));
            }
        });

        var file_xml = "OCC-return-" + returnRequestId + ".xml";
        fs.open(returnRequestConfig.dir_occ + '/' + file_xml, 'w', function (err, fd) {
            if (err) {
                throw "Error opening file " + returnRequestConfig.dir_occ + '/' + file_xml + " : " + err;
            }
            else {
                fs.writeFile(fd, json2xml.parse("RMA", data), 'utf-8');
            }
        });

        var file_json = "OCC-return-" + returnRequestId + ".json";
        fs.open(returnRequestConfig.dir_occ + '/' + file_json, 'w', function (err, fd) {
            if (err) {
                throw "Error opening file " + returnRequestConfig.dir_occ + '/' + file_json + " : " + err;
            }
            else {
                fs.writeFile(fd, JSON.stringify(data));
            }
        });
    }
}