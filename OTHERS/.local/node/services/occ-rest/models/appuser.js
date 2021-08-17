'use strict';
var dmc_user = require('../lib/dmc_user');

module.exports = function (AppUser) {

    AppUser.createUser = function (user, callback) {
        return dmc_user.createUser(user, callback);
    }

    AppUser.remoteMethod(
        'createUser', {
            http: {
                path: '/createUser',
                verb: 'post'
            },
            accepts: { arg: 'user', type: 'object', http: { source: 'body' } },
            returns: { type: 'object', root: true },
        }
    );

    AppUser.login = function (user, callback) {
        dmc_user.login(user, callback);
    };

    AppUser.remoteMethod(
        'login', {
            http: {
                path: '/login',
                verb: 'post'
            },
            accepts: { arg: 'user', type: 'object', http: { source: 'body' } },
            returns: { type: 'object', root: true },
        }
    );

    AppUser.changePassword = function (user, callback) {
        user.password = user.oldpassword;
        dmc_user.login(user, function (err, response) {
            if (err) {
                return callback(err, null)
            }
            else {
                return dmc_user.changePassword(user, callback);
            }
        });
    }

    AppUser.remoteMethod(
        'changePassword', {
            http: {
                path: '/changePassword',
                verb: 'post'
            },
            accepts: { arg: 'user', type: 'object', http: { source: 'body' } },
            returns: { type: 'object', root: true },
        }
    );

    AppUser.resetPassword = function (user, callback) {
        return dmc_user.changePassword(user, callback);
    }

    AppUser.remoteMethod(
        'resetPassword', {
            http: {
                path: '/resetPassword',
                verb: 'post'
            },
            accepts: { arg: 'user', type: 'object', http: { source: 'body' } },
            returns: { type: 'object', root: true },
        }
    );
};
