import type { Iterator } from './iterator.js';

export const readBitset = (iterator: Iterator, valueLengths: number[]) => {
  const dataView = iterator[0];
  const values: number[] = [];
  let byte: number | undefined;
  let i = 0;
  let offset = 0;
  let shift = 0;
  let value = 0;
  let valueLength = valueLengths[0];

  while (valueLength !== undefined) {
    if (byte === undefined) byte = dataView.getUint8(iterator[1]++);
    value |= (byte & ((1 << valueLength) - 1)) << shift;
    byte >>= valueLength;
    offset += valueLength;

    if (offset < 8) {
      values.push(value);
      value = 0;
      valueLength = valueLengths[++i];
      shift = 0;
    } else if (offset === 8) {
      values.push(value);
      value = 0;
      valueLength = valueLengths[++i];
      byte = dataView.getUint8(iterator[1]++);
      offset = 0;
      shift = 0;
    } else {
      const readLength = 8 - (offset - valueLength);
      valueLength -= readLength;
      byte = dataView.getUint8(iterator[1]++);
      offset = 0;
      shift += readLength;
    }
  }

  return values;
};

export const writeBitset = (
  iterator: Iterator,
  valueLengths: number[],
  values: number[],
) => {
  const dataView = iterator[0];
  let byte = 0;
  let i = 0;
  let shift = 0;
  let value = values[0];
  let valueLength = valueLengths[0];

  while (valueLength !== undefined) {
    byte |= value! << shift;
    shift += valueLength;

    if (shift < 8) {
      value = values[++i];
      valueLength = valueLengths[i];
    } else if (shift === 8) {
      dataView.setUint8(iterator[1]++, byte);
      value = values[++i];
      valueLength = valueLengths[i];
      byte = 0;
      shift = 0;
    } else {
      dataView.setUint8(iterator[1]++, byte);
      const writtenLength = 8 - (shift - valueLength);
      value! >>= writtenLength;
      valueLength -= writtenLength;
      byte = 0;
      shift = 0;
    }
  }

  if (shift > 0) {
    dataView.setUint8(iterator[1]++, byte);
  }
};
