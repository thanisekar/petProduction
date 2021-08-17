var fedexAPI = require('shipping-fedex');
var util = require('util');
var fs = require('fs');

var fedex = new fedexAPI({
  environment: 'sandbox', // or live
  debug: true,
  pretty: true,
  key: 'tFpyUKy626iBzcJR',
  password: '4rs8sVoerivMqK1OyOwfhqk5i',
  account_number: '510087240',
  meter_number: '',
  imperial: true // set to false for metric
});

/* fedex.addressvalidation({
    InEffectAsOfTimestamp: new Date(new Date().getTime() + (24 * 60 * 60 * 1000)).toISOString(),
    AddressesToValidate: [
      {
        Address: {
          StreetLines: [
            '9325 Center Lake Dr',
            'Suite 100'
          ],
          City: 'Charlotte',
          StateOrProvinceCode: 'NC',
          PostalCode: '28216',
          CountryCode: 'US'
        }
      },
      {
        Address: {
          StreetLines: [
            '601 S College St'
          ],
          City: 'Charlotte',
          StateOrProvinceCode: 'NC',
          PostalCode: '28202',
          CountryCode: 'US'
        }
      }
    ]
  }, function (err, res) {
    if (err) {
      return console.log(util.inspect(err, {depth: null}));
    }
  
    console.log(util.inspect(res, {depth: 4}));
  });
 */

/**
 *  Rates
 */
fedex.rates({
  ReturnTransitAndCommit: true,
  CarrierCodes: ['FDXE','FDXG'],
  RequestedShipment: {
    DropoffType: 'REGULAR_PICKUP',
    //ServiceType: 'FEDEX_GROUND',
    PackagingType: 'YOUR_PACKAGING',
    Shipper: {
      Contact: {
        PersonName: 'Manoj',
        CompanyName: 'TAIS',
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
        CountryCode: 'US',
        Residential: false
      }
    },
    ShippingChargesPayment: {
      PaymentType: 'SENDER',
      Payor: {
        ResponsibleParty: {
          AccountNumber: fedex.options.account_number
        }
      }
    },
    PackageCount: '1',
    RequestedPackageLineItems: {
      SequenceNumber: 1,
      GroupPackageCount: 1,
      Weight: {
        Units: 'LB',
        Value: '50.0'
      },
      Dimensions: {
        Length: 108,
        Width: 5,
        Height: 5,
        Units: 'IN'
      }
    }
  }
}, function(err, res) {
  if(err) {
    return console.log(err);
  }

  console.log(res);
});

