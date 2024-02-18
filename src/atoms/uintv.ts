import type { Iterator } from './iterator.js';

export const readBigUintv = (iterator: Iterator) => {
  const dataView = iterator[0];
  let shift = 0n;
  let value = 0n;

  while (true) {
    // Read the byte:
    const byte = dataView.getUint8(iterator[1]++);

    // Make the least significant 7 bits of the byte the most significant bits of the value:
    value |= BigInt(byte & 0b0111_1111) << shift;

    // If the current byte is not a continuation byte, return the value:
    if ((byte & 0b1000_0000) === 0) return value;

    // Increase the shift by 7 bits:
    shift += 7n;
  }
};

export const readSmallUintv = (iterator: Iterator) => {
  const dataView = iterator[0];
  let shift = 0;
  let value = 0;

  while (true) {
    // Read the byte:
    const byte = dataView.getUint8(iterator[1]++);

    // Make the least significant 7 bits of the byte the most significant bits of the value:
    value |= (byte & 0b0111_1111) << shift;

    // If the current byte is not a continuation byte, return the value:
    if ((byte & 0b1000_0000) === 0) return value;

    // Increase the shift by 7 bits:
    shift += 7;
  }
};

export const readUintv = (iterator: Iterator) => {
  return Number(readBigUintv(iterator));
};

export const writeBigUintv = (iterator: Iterator, value: bigint) => {
  const dataView = iterator[0];

  do {
    // Get the least significant 7 bits of the value:
    let byte = Number(value & 0b0111_1111n);

    // Shift to the next 7 bits of the value:
    value >>= 7n;

    // If there are remaining bits to write, mark the current byte as a continuation byte:
    if (value !== 0n) byte |= 0b1000_0000;

    // Write the byte:
    dataView.setUint8(iterator[1]++, byte);
  } while (value !== 0n);
};

export const writeSmallUintv = (iterator: Iterator, value: number) => {
  const dataView = iterator[0];

  do {
    // Get the least significant 7 bits of the value:
    let byte = value & 0b0111_1111;

    // Shift to the next 7 bits of the value:
    value >>= 7;

    // If there are remaining bits to write, mark the current byte as a continuation byte:
    if (value !== 0) byte |= 0b1000_0000;

    // Write the byte:
    dataView.setUint8(iterator[1]++, byte);
  } while (value !== 0);
};

export const writeUintv = (iterator: Iterator, value: bigint | number) => {
  if (typeof value === 'bigint' || value >= 0x80_00_00_00) {
    writeBigUintv(iterator, BigInt(value));
  } else {
    writeSmallUintv(iterator, value);
  }
};
