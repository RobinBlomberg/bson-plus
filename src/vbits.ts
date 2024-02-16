import type { DataViewIterator } from './data-view-iterator.js';
import { writeVuint } from './vint.js';

export const writeVbits = (iterator: DataViewIterator, value: boolean[]) => {
  const dataView = iterator[0];
  const length = value.length;
  writeVuint(iterator, length);
  let i = 0;
  while (i < length) {
    let byte = 0;
    let shift = 1;
    for (let j = 0; j < 8; j++) {
      if (value[i++] === true) byte |= shift;
      shift <<= 1;
    }
    dataView.setUint8(iterator[1]++, byte);
  }
};
