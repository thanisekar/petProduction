var fs = require('fs');
var path = require('path');
var moment = require('moment');
var csvWriter = require('csv-write-stream');
var parse = require('csv-parse');
var writer = csvWriter();

var emailDetails = require('../utils/GlobalData').config.emailDetails;

var nodemailer = require("nodemailer");
var smtpTransport = require('nodemailer-smtp-transport');
var xoauth2 = require('xoauth2');

const LOG = require('../utils/Logger');

var EmailService = {
    saveEmail : (request,cb)=>{
        if(fs.existsSync(emailDetails.emailCsvFilePath)){
            fs.readFile(emailDetails.emailCsvFilePath, function (err, data) {
                if(!err){
                    let fileContent = data.toString();
                    console.log("fileContent - "+fileContent);
                    if(fileContent){
                        if(fileContent.indexOf(request.emailId) === -1){
                            cb(commonWrite(request,false));
                        }else{
                            LOG.debug(request.emailId+" already exist, no need to store again.");
                            cb( true);
                        }
                    }else{
                        cb(commonWrite(request,false));
                    }
                }
            });
        }else{
            cb(commonWrite(request,true))
        }
        return false;
    },

    sendEmail : function(){
        let archiveFilePath = path.join(emailDetails.emailCsvFileDir, getArchiveFileName(new Date()));
        let fileArchived = firstArchiveEmailFile(archiveFilePath);
        let deduplicate = {};
        let csvData=[];
        let fileTobeRead = fileArchived ? archiveFilePath : emailDetails.emailCsvFilePath;

        if(fs.existsSync(fileTobeRead)){
            fs.createReadStream(fileTobeRead)
            .pipe(parse({delimiter: ','}))
            .on('data', function(csvrow) {
               // console.log(csvrow[0]+" ---- "+csvrow[1]);
                deduplicate[csvrow[0]] = csvrow[0]+","+csvrow[1];
            })
            .on('end',function() {
              for(let email in deduplicate){
                csvData.push(deduplicate[email]);
              }
              prepareAndSendData(csvData.join('\n'));
            });            
        }
    }
}

function commonWrite(request,headersRequired){
    try{
        if(headersRequired){
            writer = csvWriter({ headers: ["email", "date"]});
        }else{
            writer = csvWriter({sendHeaders: false});
        }   
        writer.pipe(fs.createWriteStream(emailDetails.emailCsvFilePath, {flags: 'a'}));
        writer.write({
            email:request.emailId,
            date:moment().format("YYYY-MM-DD HH:MM")
        });
        writer.end();
        return true;
    }catch(e){
        LOG.error("There was error in writing to csv file."+e.message);
        return false;
    }
}

function firstArchiveEmailFile(archiveFilePath){
    try{
        fs.renameSync(emailDetails.emailCsvFilePath, archiveFilePath)
    }catch(err){
        LOG.error("Error in archiving the file : "+archiveFilePath);
        return false;
    }
    return true;
}

function pad(num) {
    return (num > 9 ? "" : "0") + num;
}
 
function getArchiveFileName(time) {
     return "archive-"+time.getFullYear() + "-" + pad(time.getMonth() + 1)+ "-"+pad(time.getDate())+"-signup_emails.csv";
}


function prepareAndSendData(csvData){
    var transport = getTransportWithPassword();

    var mailOptions = {
        from: emailDetails.from, // sender address
        to: emailDetails.to, // list of receivers
        subject: emailDetails.subject, // Subject line
        text: emailDetails.text, // plaintext body
        //generateTextFromHTML: true,
        html: emailDetails.html, // html body
        attachments: [
                {
                    filename : emailDetails.attachementName,
                    content: csvData
                }
        ]
    }

    // send mail with defined transport object
    LOG.debug("==================> About to send email =============");   
    transport.sendMail(mailOptions, function(error, response){
        let result = true;
        if(error){
            LOG.debug("=============> Error : "+JSON.stringify(error));
            result = false;
        }else{
            LOG.debug("Message sent: " + JSON.stringify(response));
        }
        //res.status(200).json(response);
    });
}

/* function getTransportWithXOAuth2(){
    var transport = nodemailer.createTransport(smtpTransport({
        //service: 'Gmail',
        host : emailDetails.host,
        port: emailDetails.port,
        secure: false,
        ignoreTLS: false,
        tls: { rejectUnauthorized: true },
        auth: {
            xoauth2: xoauth2.createXOAuth2Generator({
                user: "manojtais@gmail.com", // Your gmail address. // Not @developer.gserviceaccount.com
                clientId: "920547177123-84hc5e1b5p5oelsdjrrpj4ucp5iikr88.apps.googleusercontent.com",
                clientSecret: "tvEtcalKDTd1btfj6849oQdJ",
                refreshToken: "1/kzMw8ZGDc2XVx00UsJOSXBvGx2cOMV-FDWdIakSeNLM",
                accessToken: 'ya29.GluNBaGIaTWxaHdO90Wb_GYD0FOwe7fLl83ZQvHzKBGfor-LoCQNLJrlUqrtUEGyq3MAnA62Uejdi1gfyJCWkSker60zJnQ62dgghVMUUqi1mlaEBJqTSkTgv2QD'
            })
        }

    })); 
    return transport;
} */
    function getTransportWithPassword(){
        var transport = nodemailer.createTransport(smtpTransport({
            //service: 'Gmail',
            host : emailDetails.host,
            port: emailDetails.port,
            auth: emailDetails.auth,
            secure: false,
            ignoreTLS: false,
            tls: { rejectUnauthorized: true }
            /* logger: LOG, // log to console
            debug: true, // include SMTP traffic in the logs
            proxy:''  */
        })); 
        return transport;
}

module.exports = EmailService;