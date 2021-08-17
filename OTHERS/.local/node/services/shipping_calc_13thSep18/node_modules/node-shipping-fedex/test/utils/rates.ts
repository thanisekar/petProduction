export const get = {
  ReturnTransitAndCommit: true,
  RequestedShipment: {
    DropoffType: 'REGULAR_PICKUP',
    ServiceType: 'FEDEX_GROUND',
    PackagingType: 'YOUR_PACKAGING',
    Shipper: {
      Contact: {
        PersonName: 'Sender Name',
        CompanyName: 'Company Name',
        PhoneNumber: '5555555555'
      },
      Address: {
        StreetLines: [
          '650 Princess Avenue'
        ],
        City: 'Vancouver',
        StateOrProvinceCode: 'BC',
        PostalCode: 'V6A3E1',
        CountryCode: 'CA'
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
          '650 Princess Avenue'
        ],
        City: 'Vancouver',
        StateOrProvinceCode: 'BC',
        PostalCode: 'V6A3E1',
        CountryCode: 'CA',
        Residential: false
      }
    },
    ShippingChargesPayment: {
      PaymentType: 'SENDER',
      Payor: {
        ResponsibleParty: {
          AccountNumber: process.env.FDX_ACC_NUM
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
      },
      SpecialServicesRequested: [{
        SpecialServiceTypes: 'COD',
        CodDetail: {
          CodCollectionAmount: {
            Currency: 'CAD',
            Amount: 1
          },
          AddTransportationChargesDetail: {
            RateTypeBasis: 'ACCOUNT',
            ChargeBasis: 'COD_SURCHARGE',
            ChargeBasisLevel: 'CURRENT_PACKAGE'
          },
          CollectionType: 'ANY'
        },
        SignatureOptionDetail: {
          OptionType: 'ADULT'
        }
      }]
    }
  }
};
