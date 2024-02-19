import type { Iterator } from './iterator.js';

export const readBigInt = (iterator: Iterator) => {
  const dataView = iterator[0];
  let byte = dataView.getUint8(iterator[1]++);
  const sign = byte & 0b0100_0000;
  let value = BigInt(byte) & 0b0011_1111n;
  let shift = 6n;

  // While the current byte is a continuation byte:
  while ((byte & 0b1000_0000) !== 0) {
    byte = dataView.getUint8(iterator[1]++);

    // Make the least significant 7 bits of the byte the most significant bits of the value:
    value |= (BigInt(byte) & 0b0111_1111n) << shift;
    shift += 7n;
  }

  // Apply the sign:
  return sign === 0 ? value : -value;
};

export const readSmallInt = (iterator: Iterator) => {
  const dataView = iterator[0];
  let byte = dataView.getUint8(iterator[1]++);
  const sign = byte & 0b0100_0000;
  let value = byte & 0b0011_1111;
  let shift = 6;

  // While the current byte is a continuation byte:
  while ((byte & 0b1000_0000) !== 0) {
    byte = dataView.getUint8(iterator[1]++);

    // Make the least significant 7 bits of the byte the most significant bits of the value:
    value |= (byte & 0b0111_1111) << shift;
    shift += 7;
  }

  // Apply the sign:
  return sign === 0 ? value : -value;
};

export const readInt = (iterator: Iterator) => {
  return Number(readBigInt(iterator));
};

export const writeBigInt = (iterator: Iterator, value: bigint) => {
  const dataView = iterator[0];
  const sign = value < 0 ? 0b0100_0000 : 0;

  // Remove the sign:
  if (sign !== 0) value = -value;

  let byte = Number(value & 0b0011_1111n) | sign;
  value >>= 6n;

  while (true) {
    // If there are remaining bits to write, mark the current byte as a continuation byte:
    if (value !== 0n) byte |= 0b1000_0000;
    dataView.setUint8(iterator[1]++, byte);
    if (value === 0n) return;
    byte = Number(value & 0b0111_1111n);
    value >>= 7n;
  }
};

export const writeSmallInt = (iterator: Iterator, value: number) => {
  const dataView = iterator[0];
  const sign = value < 0 ? 0b0100_0000 : 0;

  // Remove the sign:
  if (sign !== 0) value = -value;

  let byte = (value & 0b0011_1111) | sign;
  value >>= 6;

  while (true) {
    // If there are remaining bits to write, mark the current byte as a continuation byte:
    if (value !== 0) byte |= 0b1000_0000;
    dataView.setUint8(iterator[1]++, byte);
    if (value === 0) return;
    byte = value & 0b0111_1111;
    value >>= 7;
  }
};

export const writeInt = (iterator: Iterator, value: bigint | number) => {
  if (typeof value === 'bigint' || Math.abs(value) >= 0x80_00_00_00) {
    writeBigInt(iterator, BigInt(value));
  } else {
    writeSmallInt(iterator, value);
  }
};
