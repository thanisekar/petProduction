
import { test } from './test';
import { availability } from './utils';

test(
  'Get availability',
  'it should GET availability',
  'availability',
  availability.get
);
