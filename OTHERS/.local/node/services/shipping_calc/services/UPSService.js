const config = require('../config/config')


var UPSService = {
    negotiatedRates : function(){},

    publishedRates : function(){


    }


}

module.exports = UPSService;

function prepareRequest(request ){
    let upsRateReq = {
        UPSSecurity: {
          UsernameToken: {
            Username: "manojtyagi",
            Password: "l0g1n@UPS"
          },
          ServiceAccessToken: {
            AccessLicenseNumber: "BD39A96049EFAB9D"
          }
        },
        RateRequest: {
          Request: {
            RequestOption: "Rate",
            TransactionReference: {
              CustomerContext: ""
            }
          },
          Shipment: {
            Shipper: {
              Name: "",
              ShipperNumber: "3VR841",
              Address: {
                AddressLine: [],
                City: "",
                StateProvinceCode: "",
                PostalCode: "75038",
                CountryCode: "US"
              }
            },
            ShipTo: {
              Name: "",
              Address: {
                AddressLine: [ ],
                City: "",
                StateProvinceCode: "",
                PostalCode: "75038",
                CountryCode: "US"
              }
            },
            ShipFrom: {
              Name: "",
              Address: {
                AddressLine: [ ],
                City: "",
                StateProvinceCode: "TX",
                PostalCode: "75035",
                CountryCode: "US"
              }
            },
            Service: {
              Code: "03",
              Description: ""
            },
            Package: {
              PackagingType: {
                Code: "02",
                Description: ""
              },
              Dimensions: {
                UnitOfMeasurement: {
                  Code: "IN",
                  Description: "inches"
                },
                Length: 5,
                Width: 4,
                Height: 3
              },
              PackageWeight: {
                UnitOfMeasurement: {
                  Code: "Lbs",
                  Description: "pounds"
                },
                Weight: 1
              }
            },
            ShipmentRatingOptions: {
              NegotiatedRatesIndicator: ""
            }
          }
        }
      }

    


}