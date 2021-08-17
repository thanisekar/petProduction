var app = require('../server/server');
var appSettings = require("../../etc/securitysetting.json");

module.exports = {
    changePassword: function (user, cb) {
        module.exports.findUser(user, function (err, response) {
            if (err) {
                return cb(err, null);
            }
            else if (response) {
                response.updateAttribute('password', user.newpassword, function (err, updatedUser) {
                    if (err) {
                        return cb(err, null);
                    }
                    else {
                        return cb(null, updatedUser);
                    }
                });
            }
            else {
                return cb({ 'statusCode': 400, 'message': 'Invalid User' }, null);
            }
        });
    },

    findUser: function (user, cb) {
        var User = app.models.User;
        User.findOne({ where: { username: user.username, email: user.email } }, function (err, userdetails) {
            if (err) {
                return cb(err, null);
            }
            else {
                return cb(null, userdetails);
            }
        });
    },

    login: function (user, cb) {
        var User = app.models.User;
        User.login(
            { username: user.username, email: user.email, password: user.password, ttl: appSettings.tokenExpirationTime },
            function (err, logindetails) {
                if (err) {
                    return cb(err, null);
                }
                else {
                    return cb(null, logindetails);
                }
            });
    },

    createUser: function (user, cb) {
        var User = app.models.User;
        User.create(
            { username: user.username, email: user.email, password: user.password },
            function (err, userdetails) {
                if (err) {
                    return cb(err, userdetails);
                }
                else {
                    return cb(null, userdetails);
                }
            }
        );
    }
}