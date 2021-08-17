export const availability = {
  PickupAddress: {
    StreetLines: [
      '650 Princess Avenue'
    ],
    City: 'Vancouver',
    StateOrProvinceCode: 'BC',
    PostalCode: 'V6A3E1',
    CountryCode: 'CA'
  },
  PickupRequestType: 'FUTURE_DAY',
  Carriers: 'FDXE'
};

export const create = {
  OriginDetail: {
    UseAccountAddress: false,
    PickupLocation: {
      Contact: {
        PersonName: 'John Doe',
        CompanyName: 'ACME',
        PhoneNumber: '555555555'
      },
      Address: {
        StreetLines: [
          '650 princess avenue'
        ],
        City: 'Vancouver',
        StateOrProvinceCode: 'BC',
        PostalCode: 'V6A3E1',
        CountryCode: 'CA',
        'Residential': false
      }
    },
    PackageLocation: 'FRONT',
    ReadyTimestamp: '2017-07-06T12:10:00-07:00',
    CompanyCloseTime: '18:00:00'
  },
  PackageCount: 1,
  CarrierCode: 'FDXG',
  Remarks: 'abcdefgh',
  CommodityDescription: 'fdsfsd'
};

export const deletePickup = {
  CarrierCode: 'FDXG',
  PickupConfirmationNumber: '',
  ScheduledDate: '2017-09-10',
  Location: '',
  Remarks: ''
};
