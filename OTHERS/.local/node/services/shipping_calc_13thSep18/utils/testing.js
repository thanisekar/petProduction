var fs = require('fs'); 
var parse = require('csv-parse');
var deduplicate = {};
var csvData=[];
fs.createReadStream("D:\\OfficeWork\\TAIS\\projects\\WinSupply\\cat_items_from_pim\\signup_emails.csv")
    .pipe(parse({delimiter: ','}))
    .on('data', function(csvrow) {
       // console.log(csvrow[0]+" ---- "+csvrow[1]);
        //do something with csvrow
        deduplicate[csvrow[0]] = csvrow[0]+","+csvrow[1];
        //csvData.push(csvrow);        
    })
    .on('end',function() {
      //do something wiht csvData
      //console.log(csvData);
      for(let email in deduplicate){
        csvData.push(deduplicate[email]);
      }
      console.log(csvData.join('\n'));
    });