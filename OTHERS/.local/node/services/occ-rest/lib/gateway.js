'use strict';

var braintree = require('braintree');
var environment, gateway;

require('dotenv').load();

gateway = braintree.connect({
  environment: braintree.Environment.Production,
  merchantId: '5pzsq8m2sfd36gqn',
  publicKey: 'ydhrs8c9qmswmc2g',
  privateKey: '40c91eb68a060ccffb5657badbd5b066'
});

module.exports = gateway;