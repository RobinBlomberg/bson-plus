import type { DataViewIterator } from './data-view-iterator.js';
import { readVuint, writeVuint } from './vint.js';

export const readVbits = (iterator: DataViewIterator) => {
  const dataView = iterator[0];
  const length = readVuint(iterator);
  const value: boolean[] = [];
  let i = 0n;

  while (i < length) {
    const byte = dataView.getUint8(iterator[1]++);
    const byteLength = i + 8n >= length ? length - i : 8;
    let shift = 1;
    for (let j = 0; j < byteLength; j++) {
      value.push((byte & shift) !== 0);
      shift <<= 1;
    }
    i += 8n;
  }

  return value;
};

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

  return iterator[1];
};
