const date = new Date();
export const create = {
  RequestedShipment: {
    ShipTimestamp: new Date(date.getTime() + (24 * 60 * 60 * 1000)).toISOString(),
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
          AccountNumber: process.env.FDX_ACC_NUM
        }
      }
    },
    SpecialServicesRequested: {
      SpecialServiceTypes: 'EVENT_NOTIFICATION',
      EventNotificationDetail: {
        AggregationType: 'PER_SHIPMENT',
        PersonalMessage: 'personal message',
        EventNotifications: {
          Role: 'SHIPPER',
          Events: 'ON_SHIPMENT',
          NotificationDetail: {
            NotificationType: 'EMAIL',
            EmailDetail: {
              EmailAddress: 'vincent.tellier@machool.com',
              Name: 'Vincent Tellier'
            },
            Localization: {
              LanguageCode: 'en',
              // LocaleCode: 'US'
            }
          },
          FormatSpecification: {
            Type: 'HTML'
          }
        }
      }
    },
    LabelSpecification: {
      LabelFormatType: 'COMMON2D',
      ImageType: 'PDF',
      LabelStockType: 'PAPER_4X6'
    },
    PackageCount: '1',
    RequestedPackageLineItems: [{
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
            Currency: 'USD',
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
    }]
  }
};

export const deleteShipment = {
  TrackingId: {
    TrackingIdType: 'GROUND', // EXPRESS || FEDEX || GROUND || USPS
    TrackingNumber: '123456789012'
  },
  DeletionControl: 'DELETE_ALL_PACKAGES' // or DELETE_ONE_PACKAGE or LEGACY
};
