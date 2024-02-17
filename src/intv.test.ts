import { strictEqual } from 'assert';
import { test } from 'vitest';
import { readBigIntv, writeBigIntv } from './intv.js';

const dataView = new DataView(new ArrayBuffer(32));

const intv = (input: bigint) => {
  for (const value of [input, -input]) {
    writeBigIntv([dataView, 0], value);
    const output = readBigIntv([dataView, 0]);
    strictEqual(output, value);
  }
};

test('intv', () => {
  intv(123_456n);
  intv(12_345_678_901_234_567_890n);
  intv(123_456_789_012_345_678_901_234_567_890n);
});
