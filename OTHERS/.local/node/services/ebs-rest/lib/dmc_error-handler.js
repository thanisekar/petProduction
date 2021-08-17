var logger = require('./dmc_logger');
module.exports = function(options) {
  return function logError(err, req, res, next) {
    logger.error(err);
    next(err);
  };
};