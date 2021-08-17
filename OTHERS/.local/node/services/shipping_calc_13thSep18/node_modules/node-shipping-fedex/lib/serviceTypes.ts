
import * as _ from 'lodash';

export const SO = {
  code: 'SO',
  name: 'Signature option',
  list: [{
    code: 'ADULT',
    name: 'Adult signature'
  }, {
    code: 'DIRECT',
    name: 'Direct signature'
  }, {
    code: 'INDIRECT',
    name: 'Indirect signature'
  }, {
    code: 'NO_SIGNATURE_REQUIRED',
    name: 'No signature'
  },
  {
    code: 'SERVICE_DEFAULT',
    name: 'None specified'
  }]
};

export const serviceTypes = {
  PRIORITY_OVERNIGHT: {
    description: 'FedEx Priority Overnight',
    options: []
  },
  PRIORITY_OVERNIGHT_SATURDAY_DELIVERY: {
    description: 'FedEx Priority Overnight Saturday Delivery',
    options: []
  },
  FEDEX_2_DAY: {
    description: 'FedEx 2 Day',
    options: []
  },
  FEDEX_2_DAY_AM: {
    description: 'FedEx 2 Day AM Delivery',
    options: []
  },
  FEDEX_2_DAY_SATURDAY_DELIVERY: {
    description: 'FedEx 2 Day Saturday Delivery',
    options: []
  },
  STANDARD_OVERNIGHT: {
    description: 'FedEx Standard Overnight',
    options: []
  },
  FIRST_OVERNIGHT: {
    description: 'FedEx First Overnight',
    options: []
  },
  FIRST_OVERNIGHT_SATURDAY_DELIVERY: {
    description: 'FedEx First Overnight Saturday Delivery',
    options: []
  },
  FEDEX_EXPRESS_SAVER: {
    description: 'FedEx Express Saver',
    options: []
  },
  FEDEX_1_DAY_FREIGHT: {
    description: 'FedEx 1 Day Freight',
    options: []
  },
  FEDEX_1_DAY_FREIGHT_SATURDAY_DELIVERY: {
    description: 'FedEx 1 Day Freight Saturday Delivery',
    options: []
  },
  FEDEX_2_DAY_FREIGHT: {
    description: 'FedEx 2 Day Freight',
    options: []
  },
  FEDEX_2_DAY_FREIGHT_SATURDAY_DELIVERY: {
    description: 'FedEx 2 Day Freight Saturday Delivery',
    options: []
  },
  FEDEX_3_DAY_FREIGHT: {
    description: 'FedEx 3 Day Freight',
    options: []
  },
  FEDEX_3_DAY_FREIGHT_SATURDAY_DELIVERY: {
    description: 'FedEx 3 Day Freight Saturday Delivery',
    options: []
  },
  INTERNATIONAL_PRIORITY: {
    description: 'FedEx International Priority',
    options: []
  },
  INTERNATIONAL_PRIORITY_SATURDAY_DELIVERY: {
    description: 'FedEx International Priority Saturday Delivery',
    options: []
  },
  INTERNATIONAL_ECONOMY: {
    description: 'FedEx International Economy',
    options: []
  },
  INTERNATIONAL_FIRST: {
    description: 'FedEx International First',
    options: []
  },
  INTERNATIONAL_PRIORITY_FREIGHT: {
    description: 'FedEx International Priority Freight',
    options: []
  },
  INTERNATIONAL_ECONOMY_FREIGHT: {
    description: 'FedEx International Economy Freight',
    options: []
  },
  GROUND_HOME_DELIVERY: {
    description: 'FedEx Ground Home Delivery',
    options: []
  },
  FEDEX_GROUND: {
    description: 'FedEx Ground',
    options: [{
      code: 'COD',
      name: 'Collect on delivery',
    }]
  },
  INTERNATIONAL_GROUND: {
    description: 'FedEx International Ground',
    options: [{
      code: 'COD',
      name: 'Collect on delivery',
    }]
  },
  SMART_POST: {
    description: 'FedEx SmartPost',
    options: []
  },
  FEDEX_FREIGHT_PRIORITY: {
    description: 'FedEx Freight Priority',
    options: []
  },
  FEDEX_FREIGHT_ECONOMY: {
    description: 'FedEx Freight Economy',
    options: []
  }
};

_.forEach(serviceTypes, (service) => {
  service.options.push(SO);
});