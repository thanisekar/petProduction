
export const get = {
  InEffectAsOfTimestamp: new Date(new Date().getTime() + (24 * 60 * 60 * 1000)).toISOString(),
  AddressesToValidate: [{
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
  }, {
    Address: {
      StreetLines: [
        '601 S College St'
      ],
      City: 'Charlotte',
      StateOrProvinceCode: 'NC',
      PostalCode: '28202',
      CountryCode: 'US'
    }
  }]
};
