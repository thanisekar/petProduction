
import { test } from './test';
import { shipment } from './utils';

test(
  'Create shipment',
  'it should POST shipment',
  'ship',
  shipment.create
);

test(
  'Delete shipment',
  'it should DELETE shipment',
  'deleteshipment',
  shipment.deleteShipment
);
