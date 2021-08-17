var moment = require('moment');
var csvWriter = require('csv-write-stream')
var writer = csvWriter();
var fs = require('fs');
const csvFilePath = require('../utils/GlobalData').config.emailCsvFilePath;
const LOG = require('../utils/Logger');

var EmailService = {
    saveEmail : (request)=>{
        try{
            if (!fs.existsSync(csvFilePath)){
                writer = csvWriter({ headers: ["email", "date"]});
            }else{
                writer = csvWriter({sendHeaders: false});
            }   
            writer.pipe(fs.createWriteStream(csvFilePath, {flags: 'a'}));
            writer.write({
                email:request.emailId,
                date:moment().format("YYYY-MM-DD HH:MM")
            });
            writer.end();

        }catch(e){
            LOG.error("There was error in writing to csv file.");
            return false;
        }
        return true;
    }
}

module.exports = EmailService;