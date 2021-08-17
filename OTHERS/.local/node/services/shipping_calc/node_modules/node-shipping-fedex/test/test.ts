
require('dotenv').config();
import * as chai from 'chai';
import { logger } from '../lib/utils/logger';
import FedExAPI from '../lib';

const should = chai.should();
const expect = chai.expect;

const error = (err) => {
  err.should.be.a('object');
};

const success = (res) => {
  res.should.be.a('object');
};

export const test = (title, desc, fn, params) => {

  describe(title, () => {
    it(desc, (done) => {

      const fedex = new FedExAPI({
        environment: process.env.FDX_ENV,
        debug: true,
        key: process.env.FDX_KEY,
        password: process.env.FDX_PWD,
        account_number: process.env.FDX_ACC_NUM,
        meter_number: process.env.FDX_MET_NUM,
        imperial: true
      });

      fedex[fn](params, (err, res) => {
        if (err) {
          logger.debug('results from server err', err);
          error(err);
        }

        success(res);

        done();
      });

    });

  });

};
