import { test } from 'vitest';
import { writeVbits } from './vbits.js';

const dataView = new DataView(new ArrayBuffer(32));

test('vbits', () => {
  const O = false;
  const I = true;
  writeVbits([dataView, 0], [I, O, I, I, O, I, O, I, I, O, I]);
  console.log(dataView.getUint8(0));
  console.log(dataView.getUint8(1).toString(2).split('').reverse().join(''));
  console.log(dataView.getUint8(2).toString(2).split('').reverse().join(''));
});
