
var internalLogger = {};
var Logger = {
    setLogger : function(logger){
        internalLogger = logger;
    },

    debug : function(message,...args){
        console.log("Inside Debug");
        internalLogger.debug(message,...args);
    },

    info : function(message,...args){
        internalLogger.info(message,...args);
    },

    error : function(message,...args){
        internalLogger.error(message,...args);
    },

    warn : function(message,...args){
        internalLogger.warning(message,...args);
    }
}


module.exports = Logger;