
require('dotenv').config();
import express = require('express');
import FedExAPI from './lib/index';
import { logger } from './lib/utils/logger';
import * as utils from './test/utils';

export class Server {

  constructor(
    private app: express.Express,
    private port: number
  ) {
    this.configureRoutes(app);
  }

  public run() {
    this.app.listen(this.port);
  }

  private configureRoutes(app: express.Express) {

    const fedex = new FedExAPI({
      environment: process.env.FDX_ENV, // or live
      debug: true,
      key: process.env.FDX_KEY,
      password: process.env.FDX_PWD,
      account_number: process.env.FDX_ACC_NUM,
      meter_number: process.env.FDX_MET_NUM,
      imperial: true // set to false for metric
    });

    app.get('/', (req, res) => {

      const params = utils.tracking.get;
      fedex.track(params, (err, result) => {
        if (err) {
          logger.debug('results from server err', err);
          return res.send(err);
        }

        return res.send(result);
      });

    });

  }

}

// Set up the server
let port = 8881;
let api = new Server(express(), port);
api.run();
console.info(`listening on ${port}`);
