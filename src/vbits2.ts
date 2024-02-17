import type { DataViewIterator } from './data-view-iterator.js';

export const readBigVbits = (iterator: DataViewIterator) => {
  const dataView = iterator[0];
  let value = 0n;
  let shift = 0n;

  while (true) {
    const byte = dataView.getUint8(iterator[1]++);
    value |= BigInt(byte & 127) << shift;
    if ((byte & 128) === 0) break;
    shift += 7n;
  }

  return value;
};

export const readVbits = readBigVbits;

export const writeBigVbits = (iterator: DataViewIterator, value: boolean[]) => {
  const dataView = iterator[0];
  const length = value.length;
  let i = 0;

  do {
    let byte = 0;
    let shift = 64;
    const maxLength = 1;
    for (let j = 0; j < 7; j++) {
      console.log(value, shift);
      if (value[i++] === true) byte |= shift;
      shift >>= 1;
    }
    if (i < length) byte |= 128;
    dataView.setUint8(iterator[1]++, byte);
  } while (i < length);

  return iterator[1];
};

export const writeVbits = writeBigVbits;
