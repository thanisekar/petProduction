
import { test } from './test';
import { tracking } from './utils';

test(
  'Tracking shipment',
  'it should GET tracking',
  'track',
  tracking.get
);
