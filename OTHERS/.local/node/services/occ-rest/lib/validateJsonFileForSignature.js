var crypto = require('crypto');
var SHARED_SECRET = "UgsgG4ORC1y16ttw1hi4EAveJU/XClXB/Lq23jQhYynvnlHl9Vl9j7CMoUxuDoFBbf2IRR2Z4p5Q8HietQoDhQ==";

console.log("------------------------------   BODY --------------------------------------------------");
fs = require('fs')
fs.readFile('/.local/node/services/occ-rest/lib/o261869-rawMessageSentFromWebhook.txt', 'utf8', function (err, data) {
    if (err) {
        return console.log(err);
    }
    console.log(data);
    console.log("-------------------------------  SECRET KEY & SIGNATURES -------------------------------------------------");
    
    /*
    var hmac = crypto.createHmac('sha1', SHARED_SECRET);
    hmac.write(data);
    hmac.end();
    var sig = hmac.read();
    console.log("Signature : " + sig.toString('base64'));
    */
    
    var decoded_secret_key = Buffer.from(SHARED_SECRET, 'base64');
    var calculated_signature = crypto.createHmac('sha1', decoded_secret_key)
        .update(data, 'UTF-8')
        .digest('base64');

    console.log("HMAC Secret Key from Webhook : " + SHARED_SECRET);
    console.log("Derived Signature : " + calculated_signature);
    console.log("OCC Request Header Signature : " + "k6Hpx20wqMXLgpvLfxoZjHrsvAU=");
    console.log("--------------------------------------------------------------------------------");
});

