import { test } from 'vitest';
import { writeBitsv } from './bitsv.js';

const dataView = new DataView(new ArrayBuffer(32));

test('bitsv', () => {
  writeBitsv([dataView, 0], [[21, 0b1010_1010_1010_1010_1010_1010_1010_1010]]);
  console.log(dataView.getUint8(0).toString(2).padStart(8, '0'));
  console.log(dataView.getUint8(1).toString(2).padStart(8, '0'));
  console.log(dataView.getUint8(2).toString(2).padStart(8, '0'));
});
