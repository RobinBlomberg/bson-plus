import { strictEqual } from 'assert';
import { test } from 'vitest';
import { readUintv, writeUintv } from './uintv.js';

const dataView = new DataView(new ArrayBuffer(32));

const uintv = (input: bigint) => {
  writeUintv([dataView, 0], input);
  const output = readUintv([dataView, 0]);
  strictEqual(output, input);
};

test('uintv', () => {
  uintv(123_456n);
  uintv(12_345_678_901_234_567_890n);
  uintv(123_456_789_012_345_678_901_234_567_890n);
});
