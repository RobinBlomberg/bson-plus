import type { DataViewIterator } from './data-view-iterator.js';
import { readVuint, writeVuint } from './vint.js';

export const readDecimal = (iterator: DataViewIterator) => {
  const dataView = iterator[0];
  const byte = dataView.getUint8(iterator[1]++);
  const sign = byte & 128;
  const significandLength = byte & 127;
  let value = Number(readVuint(iterator));

  if (significandLength !== 0) {
    const string = String(value);
    value =
      +`${string.slice(0, -significandLength)}.${string.slice(-significandLength)}`;
  }

  return sign === 0 ? value : -value;
};

export const writeDecimal = (
  iterator: DataViewIterator,
  value: bigint | number,
) => {
  const dataView = iterator[0];
  const sign = Object.is(value, -0) || value < 0 ? 128 : 0;
  if (sign !== 0) value = -value;
  const string = String(value);
  const stringLength = string.length;
  let significandLength = 0;

  for (let i = 1; i < stringLength; i++) {
    if (string[i] === '.') {
      significandLength = stringLength - i - 1;
      value = BigInt(`${string.slice(0, i)}${string.slice(i + 1)}`);
      break;
    }
  }

  dataView.setUint8(iterator[1]++, sign | significandLength);
  return writeVuint(iterator, value);
};
