var winston = require('winston');
var logger_file_config = require('../server/logger.file.json');
var logger_console_config = require('../server/logger.console.json');
winston.emitErrs = true;

var logger = new winston.Logger({
    transports: [
        new winston.transports.File(logger_file_config),
        new winston.transports.Console(logger_console_config)
    ],
    exitOnError: false
});

module.exports = logger;
module.exports.stream = {
    write: function(message, encoding){
        logger.error(message);
    }
};