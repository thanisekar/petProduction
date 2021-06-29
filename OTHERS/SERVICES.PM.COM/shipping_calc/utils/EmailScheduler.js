    var cron = require('node-cron');
var emailService = require('../services/EmailService');
var emailDetails = require('../utils/GlobalData').config.emailDetails;

module.exports = function(){
    console.log('=====>Scheduling email : '+emailDetails.cronExpression);
    cron.schedule(emailDetails.cronExpression, function(){
      console.log('=====>Sending email');
      emailService.sendEmail();
    });

}