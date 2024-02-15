import { strictEqual } from 'assert';
import { test } from 'vitest';
import { countDecimals } from './count-decimals.js';

test('countDecimals', () => {
  strictEqual(countDecimals(0), 0);
  strictEqual(countDecimals(0.1), 1);
  strictEqual(countDecimals(0.12), 2);
  strictEqual(countDecimals(0.123), 3);
  strictEqual(countDecimals(0.1234), 4);
  strictEqual(countDecimals(0.123_45), 5);
  strictEqual(countDecimals(0.142_857_142_857_142_85), 17);
  strictEqual(countDecimals(142_857.142_857_142), 9);
});
