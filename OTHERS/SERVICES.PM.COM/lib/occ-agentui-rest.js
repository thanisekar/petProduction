var loopback = require("loopback");
var occ_agentui_conn = require('../etc/occ_agentui_conn.json');

module.exports = {
    login: function (callback) {
        var ds = loopback.createDataSource({
            connector: require("loopback-connector-rest"),
            strictSSL: false,
            defaults: {

            },
            operations: [
                {
                    template: {
                        "url": occ_agentui_conn.hostname + "/v1/login/",
                        "method": "POST",
                        "headers": {
                            "accept": "application/json",
                            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                        },
                        "body": occ_agentui_conn.logincredential,
                    },
                    functions: {
                        "getToken": ""
                    }
                }
            ]
        });
        var model = ds.createModel('occ_agentui');
        model.getToken(function (err, result) {            
            if (err) {
                return callback(err, null);
            }
            else {
                return callback(null, result);
            }
        });
    },

    post: function (url, data, callback) {
        var accessToken;
        module.exports.login(function (err, response) {
            if (err)
                return callback(err, response);
            else
            {
                var loginResponse = JSON.parse(response);
                accessToken = "Bearer " + loginResponse.access_token;
            }
            var ds = loopback.createDataSource({
                connector: require("loopback-connector-rest"),
                strictSSL: true,
                operations: [
                    {
                        template: {
                            "url": occ_agentui_conn.hostname + url,
                            "method": "POST",
                            "headers": {
                                "accept": "application/json",
                                "content-type": "application/json",
                                "authorization": accessToken
                            },
                            "body": data,
                        },
                        functions: {
                            "getResponse": ""
                        }
                    }
                ]
            });
            var model = ds.createModel('occ_agentui');
            model.getResponse(function (err, result) {
                if (err) {
                    console.log("POST ERROR ::::");
                    console.log(err);
                    return callback(err, result);
                }
                else {
                    console.log("POST SUCCESS ::::");
                    console.log(result);
                    return callback(err, result);
                }
            });
        });
    }
}
