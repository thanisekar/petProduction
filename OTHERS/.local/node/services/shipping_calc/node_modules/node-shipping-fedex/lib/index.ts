
import * as path from 'path';
import * as _ from 'lodash';
import * as soap from 'soap';
import * as parser from 'xml2js';
import { logger } from './utils/logger';

import { serviceTypes, SO } from './serviceTypes';

export default class FedExAPI {
  private account_number: string = this.params.account_number;
  private debug: boolean = this.params.debug;
  private endpoint: string;
  private environment: string = this.params.environment;
  private meter_number: string = this.params.meter_number;
  private key: string = this.params.key;
  private password: string = this.params.password;
  private isProduction: Boolean = this.environment === 'production' ? true : false;

  constructor(
    private params: any
  ) {
    this.endpoint = this.isProduction ? 'https://ws.fedex.com' : 'https://wsbeta.fedex.com';
  }

  public addressvalidation(params: any, cb: any) {

    const resource = {
      version: {
        ServiceId: 'aval',
        Major: 4,
        Intermediate: 0,
        Minor: 0
      }
    };

    this.request(params, 'addressValidation', 'AddressValidationService_v4.wsdl', resource, (err, res) => {
      return cb(err, res);
    });

  }

  public availability(params: any, cb: any) {

    const resource = {
      version: {
        ServiceId: 'vacs',
        Major: 6,
        Intermediate: 0,
        Minor: 0
      }
    };

    this.request(params, 'serviceAvailability', 'ValidationAvailabilityAndCommitmentService_v6.wsdl', resource, (err, res) => {
      return cb(err, res);
    });

  }

  public cancelPickup(params: any, cb: any) {

    const resource = {
      version: {
        ServiceId: 'disp',
        Major: 13,
        Intermediate: 0,
        Minor: 0
      }
    };

    this.request(params, 'cancelPickup', 'PickupService_v13.wsdl', resource, (err, res) => {
      return cb(err, res);
    });

  }

  public pickup(params: any, cb: any) {

    const resource = {
      version: {
        ServiceId: 'disp',
        Major: 13,
        Intermediate: 0,
        Minor: 0
      }
    };

    this.request(params, 'createPickup', 'PickupService_v13.wsdl', resource, (err, res) => {
      return cb(err, res);
    });

  }

  public pickupAvailability(params: any, cb: any) {

    const resource = {
      version: {
        ServiceId: 'disp',
        Major: 13,
        Intermediate: 0,
        Minor: 0
      }
    };

    this.request(params, 'getPickupAvailability', 'PickupService_v13.wsdl', resource, (err, res) => {
      return cb(err, res);
    });

  }

  public rates(params: any, cb: any) {

    const resource = {
      version: {
        ServiceId: 'crs',
        Major: 20,
        Intermediate: 0,
        Minor: 0
      }
    };

    this.request(params, 'getRates', 'RateService_v20.wsdl', resource, (err, res) => {
      return cb(err, res);
    });

  }

  public freight_rates(params: any, cb: any) {

    const resource = {
      version: {
        ServiceId: 'crs',
        Major: 20,
        Intermediate: 0,
        Minor: 0
      }
    };

    this.request(params, 'getRates', 'RateService_v20.wsdl', resource, (err, res) => {
      return cb(err, res);
    });

  }

  public ship(params: any, cb: any) {

    const resource = {
      version: {
        ServiceId: 'ship',
        Major: 19,
        Intermediate: 0,
        Minor: 0
      }
    };

    this.request(params, 'processShipment', 'ShipService_v19.wsdl', resource, (err, res) => {
      return cb(err, res);
    });

  }

  public deleteshipment(params: any, cb: any) {

    const resource = {
      version: {
        ServiceId: 'ship',
        Major: 19,
        Intermediate: 0,
        Minor: 0
      }
    };

    this.request(params, 'deleteShipment', 'ShipService_v19.wsdl', resource, (err, res) => {
      return cb(err, res);
    });

  }

  public track(params: any, cb: any) {

    const resource = {
      version: {
        ServiceId: 'trck',
        Major: 12,
        Intermediate: 0,
        Minor: 0
      }
    };

    this.request(params, 'track', 'TrackService_v12.wsdl', resource, (err, res) => {
      return cb(err, res);
    });

  }

  public smartpostclose(params: any, cb: any) {

    const resource = {
      version: {
        ServiceId: 'clos',
        Major: 4,
        Intermediate: 0,
        Minor: 0
      }
    };

    this.request(params, 'smartPostClose', 'CloseService_v4.wsdl', resource, (err, res) => {
      return cb(err, res);
    });

  }

  public groundclose(params: any, cb: any) {

    const resource = {
      version: {
        ServiceId: 'clos',
        Major: 4,
        Intermediate: 0,
        Minor: 0
      }
    };

    this.request(params, 'groundClose', 'CloseService_v4.wsdl', resource, (err, res) => {
      return cb(err, res);
    });

  }

  public serviceOptions(service, cb) {
    if (!serviceTypes[service]) {
      return cb([{ error: 'service not found' }], null);
    }

    return cb(null, serviceTypes[service].options);
  }

  public serviceDescription(service, cb) {
    if (!serviceTypes[service]) {
      return cb([{ error: 'service not found' }], null);
    }

    return cb(null, serviceTypes[service].description);
  }

  public signatureOptionDescription(code, cb) {
    let serviceOption = _.find(SO.list, (o) => { return o.code === code; });

    if (!serviceOption) {
      return cb([{ error: 'signature option not found' }], null);
    }

    return cb(null, serviceOption.name);
  }

  private request(params: any, fn: string, wsdl, options: any, cb) {

    soap.createClient(path.join(__dirname, 'wsdl', wsdl), {
      endpoint: `${this.endpoint}/web-services`
    }, (err, client) => {
      if (err) {
        return cb(err, null);
      }

      params = this.generateAuthentication(params, options);

      client[fn](params, (err, result) => {
        if (this.debug) {
          parser.parseString(client.lastRequest, { explicitArray: false }, (err, res, body) => {
            logger.info(body);
          });
        }

        if (err) {
          return this.handleResponseError(err, cb);
        }

        return cb(err, result);
      });
    });
  }

  private handleResponseError(err: any, cb: any) {

    try {
      return cb(err.root.Envelope.Body.Fault, null);
    } catch (e) {
      if (this.debug) {
        logger.error(err);
      }
      return cb(err, null);
    }

  }

  private generateAuthentication(data: any, options: any) {

    const params = {
      WebAuthenticationDetail: {
        UserCredential: {
          Key: this.key,
          Password: this.password
        }
      },
      ClientDetail: {
        AccountNumber: this.account_number,
        MeterNumber: this.meter_number
      }
    };

    if (options && options.version) {
      params['Version'] = {
        ServiceId: options.version.ServiceId,
        Major: options.version.Major,
        Intermediate: options.version.Intermediate,
        Minor: options.version.Minor
      };
    }

    return _.extend(params, data);
  }

}

exports.default = FedExAPI;
module.exports = exports['default'];
