var crypto = require('crypto');
//var shared_secret = require("../lib/secret.json");
//var bufferEq = require('buffer-equal-constant-time');
//var SHARED_SECRET = 'E5P6Ya1I31ooxVAJ08/PVZXJoq7RMPGbe/WQbkjhMaCpEWYK2IhDCmMBBPjq7geyFB0l+8vWZcHXxYEQmem84A==';
var SHARED_SECRET = 'UgsgG4ORC1y16ttw1hi4EAveJU/XClXB/Lq23jQhYynvnlHl9Vl9j7CMoUxuDoFBbf2IRR2Z4p5Q8HietQoDhQ==';

module.exports =
    {
        verifySignature: function (data, signature) {
            
            var jsondata = JSON.stringify(data);
            var hmac = crypto.createHmac('sha1', SHARED_SECRET);
            hmac.write(jsondata);
            hmac.end();
            var sig = hmac.read();
            
            //console.log("Signature Decrypted from Body :: " +sig.toString('base64'));
            //return bufferEq(new Buffer(sig.toString('base64')), new Buffer(signature));
            
            var decoded_secret_key = Buffer.from(SHARED_SECRET, 'base64');
            var calculated_signature = crypto.createHmac('sha1', decoded_secret_key)
                .update(jsondata, 'UTF-8')
                .digest('base64');
            
            console.log("-------------------------------  SECRET KEY & SIGNATURES -------------------------------------------------");
            console.log("HMAC Secret Key from Webhook : " + SHARED_SECRET);
            console.log("Derived Signature : " + calculated_signature);
            console.log("OCC Request Header Signature : " + signature);
            
            console.log("Without Base64 : " + sig.toString('base64'));
            console.log("--------------------------------------------------------------------------------");
            
            return true;
        },
        
        createSignature: function (data) {
            var jsondata = JSON.stringify(data);
            //var v = crypto.createHmac('sha1', SHARED_SECRET).update(jsondata, 'utf8').digest('base64');
            //console.log(v);
            var hmac = crypto.createHmac('sha1', SHARED_SECRET);
            hmac.write(jsondata);
            hmac.end()
            var sig = new Buffer(hmac.read()).toString('base64');
            return sig;
        }
    }