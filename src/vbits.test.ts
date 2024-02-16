import { deepStrictEqual, strictEqual } from 'assert';
import { describe, test } from 'vitest';
import { readVbits, writeVbits } from './vbits.js';

const dataView = new DataView(new ArrayBuffer(32));

const vbits = (input: string, expectedLength: number) => {
  const expectedValue = input.split('').map((bit) => bit === '1');
  const length = writeVbits([dataView, 0], expectedValue);
  const value = readVbits([dataView, 0]);
  deepStrictEqual(value, expectedValue);
  strictEqual(length, expectedLength);
};

describe('vbits', () => {
  test('1 + 0 bytes', () => {
    vbits('', 1);
  });

  test('1 + 1 bytes', () => {
    vbits('0', 2);
    vbits('1', 2);
    vbits('00', 2);
    vbits('01', 2);
    vbits('10', 2);
    vbits('11', 2);
    vbits('000', 2);
    vbits('001', 2);
    vbits('010', 2);
    vbits('011', 2);
    vbits('100', 2);
    vbits('101', 2);
    vbits('110', 2);
    vbits('111', 2);
    vbits('0101', 2);
    vbits('101010', 2);
    vbits('00000000', 2);
    vbits('01010101', 2);
    vbits('11111111', 2);
  });

  test('1 + 2 bytes', () => {
    vbits('000000001', 3);
    vbits('010101010', 3);
    vbits('101010101', 3);
    vbits('100100100', 3);
    vbits('100000000', 3);
    vbits('001001001001', 3);
    vbits('10001000100010', 3);
    vbits('0000000000000000', 3);
    vbits('1111111111111111', 3);
  });

  test('1 + 8 bytes', () => {
    vbits(
      '1001001010100100101010100101010100101010100101010100101010100101',
      9,
    );
  });
});
