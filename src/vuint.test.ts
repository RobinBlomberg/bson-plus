import { strictEqual, throws } from 'assert';
import { describe, test } from 'vitest';
import {
  readBigVuint,
  readSmallVuint,
  writeBigVuint,
  writeSmallVuint,
  writeVuint,
} from './vuint.js';

const dataView = new DataView(new ArrayBuffer(9));

const bigVuint = (input: bigint) => {
  writeBigVuint(dataView, 0, input);
  const output = readBigVuint(dataView, 0);
  strictEqual(input, output);
};

const smallVuint = (input: number) => {
  writeSmallVuint(dataView, 0, input);
  const output = readSmallVuint(dataView, 0);
  strictEqual(input, output);
};

const vuint = (input: bigint | number, expectedOutput = input) => {
  writeVuint(dataView, 0, input);
  const output = readBigVuint(dataView, 0);
  strictEqual(output, expectedOutput);
};

describe('vuint', () => {
  test('arbitrary values', () => {
    vuint(0, 0n);
    vuint(127, 127n);
    vuint(128, 128n);
    vuint(16_383, 16_383n);
    vuint(16_384, 16_384n);
    vuint(2_097_151, 2_097_151n);
    vuint(2_097_152, 2_097_152n);
    vuint(268_435_455, 268_435_455n);
    vuint(268_435_456, 268_435_456n);
    vuint(2_147_483_647, 2_147_483_647n);
    vuint(0n);
    vuint(127n);
    vuint(128n);
    vuint(16_383n);
    vuint(16_384n);
    vuint(2_097_151n);
    vuint(2_097_152n);
    vuint(268_435_455n);
    vuint(268_435_456n);
    vuint(2_147_483_647n);
    vuint(2_147_483_648n);
    vuint(9_223_372_036_854_775_807n);
    throws(() => writeVuint(dataView, 0, 9_223_372_036_854_775_808n));
  });

  test('big values', () => {
    bigVuint(0n);
    bigVuint(127n);
    bigVuint(128n);
    bigVuint(16_383n);
    bigVuint(16_384n);
    bigVuint(2_097_151n);
    bigVuint(2_097_152n);
    bigVuint(268_435_455n);
    bigVuint(268_435_456n);
    bigVuint(2_147_483_647n);
    bigVuint(2_147_483_648n);
    bigVuint(9_223_372_036_854_775_807n);
    throws(() => writeBigVuint(dataView, 0, 9_223_372_036_854_775_808n));
  });

  test('small values', () => {
    smallVuint(0);
    smallVuint(127);
    smallVuint(128);
    smallVuint(16_383);
    smallVuint(16_384);
    smallVuint(2_097_151);
    smallVuint(2_097_152);
    smallVuint(268_435_455);
    smallVuint(268_435_456);
    smallVuint(2_147_483_647);
    throws(() => writeSmallVuint(dataView, 0, 2_147_483_648));
  });
});
