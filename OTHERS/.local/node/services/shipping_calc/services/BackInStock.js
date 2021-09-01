var fs = require('fs');
var moment = require('moment');
var csvWriter = require('csv-write-stream');

var writer = csvWriter();

var emailDetails = require('../utils/GlobalData').config.emailDetails;



const LOG = require('../utils/Logger');

var BackInStock = {
    saveEmail : (request,cb)=>{
        if(fs.existsSync(emailDetails.instockFilePath)){
            console.log(emailDetails.instockFilePath,'emailDetails.instockFilePath');
            fs.readFile(emailDetails.instockFilePath, function (err, data) {
                if(!err){
                    let fileContent = data.toString();
                    console.log("fileContent - "+fileContent);
                    if(fileContent){
                        cb(commonWrite(request,false));
                    }else{
                        cb(commonWrite(request,false));
                    }
                }
            });
        }else{
            cb(commonWrite(request,true))
        }
        return false;
    }
}

function commonWrite(request,headersRequired){
    try{
        if(headersRequired){
            writer = csvWriter({ headers: ["email", "date","item"]});
        }else{
            writer = csvWriter({sendHeaders: false});
        }   
        writer.pipe(fs.createWriteStream(emailDetails.instockFilePath, {flags: 'a'}));
        writer.write({
            email:request.emailId,
            date:moment().format("YYYY-MM-DD HH:MM"),
            item: request.item
        });
        writer.end();
        return true;
    }catch(e){
        LOG.error("There was error in writing to csv file."+e.message);
        return false;
    }
}








module.exports = BackInStock;