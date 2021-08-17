
import { test } from './test';
import { rates } from './utils';

test(
  'Get rates',
  'it should GET rates',
  'rates',
  rates.get
);
