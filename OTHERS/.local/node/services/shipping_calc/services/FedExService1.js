var path = require('path');
var soap = require('soap');

var url = path.join(__dirname, 'RateService_v22.wsdl');

var params = {
      WebAuthenticationDetail: {
        UserCredential: {
          Key: 'nURx5pljlbCLQhky',
          Password: 'tqb9wI6C2TOns8fpwwsdFC0wv'
        }
      },
      ClientDetail: {
        AccountNumber: '510087720',
        MeterNumber: '119025752',
        Localization: {
            LanguageCode: 'EN'
        }
      },
      Version: {
        ServiceId: 'crs',
        Major: '20', 
        Intermediate: '0',
        Minor: '0'
      },
      RateRequest: {  
        ReturnTransitAndCommit: true,
        RequestedShipment: {
            DropoffType: 'REGULAR_PICKUP',
            PackagingType: 'FEDEX_10KG_BOX',
            RateRequestTypes: 'LIST',
            PackageCount: '1',
            Shipper: {
                Contact: {
                    PersonName: 'Sender Name',
                    CompanyName: 'Company Name',
                    PhoneNumber: '5555555555'
                },
                Address: {
                    StreetLines: [
                    'Address Line 1'
                    ],
                    City: 'Collierville',
                    StateOrProvinceCode: 'TN',
                    PostalCode: '38017',
                    CountryCode: 'US'
                }
            },
            Recipient: {
                Contact: {
                    PersonName: 'Recipient Name',
                    CompanyName: 'Company Receipt Name',
                    PhoneNumber: '5555555555'
                },
                Address: {
                    StreetLines: [
                    'Address Line 1'
                    ],
                    City: 'Charlotte',
                    StateOrProvinceCode: 'NC',
                    PostalCode: '28202',
                    CountryCode: 'US'
                }
            }
        }
    }
};

soap.createClient(url, function(err, client) {
  if (err) throw err; 
  client.RateService.RateServicePort.getRates(params, function(err, result) {
    console.log(JSON.stringify(result));
});
});

/* app.get('/describe',function(req,res){
    soap.createClient(url, function(err, client) {
        if (err) throw err; 
        res.send(client.describe());
    });
});

app.get('/test',function(req,res){
    soap.createClient(url, function(err, client) {
        if (err) throw err; 
        client.RateService.RateServicePort.getRates(params, function(err, result) {
          res.send(result);
      });
    });
})

app.listen(port, function(){
    console.log('app listening on port '+ port);
}) */