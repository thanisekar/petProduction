// Dependencies
var express = require('express');
var CronJob = require('cron').CronJob;
var https = require('https');
var fs = require('fs');

// App definition
var app = express();

new CronJob('0 */30 * * * *', function () {

	//const dirPath = "E:/Petmate/services/occ-rest/data/df";
	//
	const dirPath = "/.local/node/services/occ-rest/data/df";
	const files = fs.readdirSync(dirPath);
	
	if (files.length > 0) {

		const arrFiles = [];
		for (var i in files) {
			
			const name = files[i].split(".");
			/*var fileStats = fs.statSync(dirPath);
			var ctime = fileStats.ctime;
			var tenMinutesAgo = new Date(Date.now()-1000*60*10)
			console.log ('now:', new Date(Date.now()));
			console.log ('ctime:', ctime);
			console.log ('tenMinutesAgo:', tenMinutesAgo);
			console.log ('fileStats:', fileStats);
			if (ctime > tenMinutesAgo) {
*/
				if (name[0].startsWith("Inventory")) {
					arrFiles.push(files[i]);
				}
			//}
		}

		if (arrFiles.length > 0) {
			for (i = 0; i < arrFiles.length; i++) {
				const newFile = arrFiles[i];
				return new Promise(function () {
					console.log('inside promise ----', newFile);
					callApi(newFile);
				})
			}
		} else {
			console.log('There are no files to process now');
		}
	} else {
		console.log('There are no files to process now');
	}

}, null, true);

var portNum = 8000;
app.listen(8000, function () {
	console.log('Server listening on port ', portNum);
});

function callApi(fileName) {

	// payload
	var postData = JSON.stringify({
		"fileName": fileName
	});

	// headers
	var postheaders = {
		'Content-Type': 'application/json',
		'Content-Length': Buffer.byteLength(postData, 'utf8')
	};

	process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

	// the options
	var optionsPost = {
		host: 'services.petmate.com',
		port: 443,
		path: '/b2c/api/v1/assets/upload',
		method: 'POST',
		headers: postheaders,
		rejectUnauthorized: false,
		requestCert: true,
		agent: false
	};

	// do the post call
	var reqUpload = https.request(optionsPost, function (res) {
		console.log("statusCode: ", res.statusCode);
		res.on('data', function (d) {
			console.info('POST result:\n');
			process.stdout.write(d);
			console.info('\n\nPOST completed');
		});
	});

	// write the json data
	reqUpload.write(postData);
	reqUpload.end();
	reqUpload.on('error', function (e) {
		console.error(e);
	});

}