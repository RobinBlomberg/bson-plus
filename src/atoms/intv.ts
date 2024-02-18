import type { Iterator } from './iterator.js';

export const readBigIntv = (iterator: Iterator) => {
  const dataView = iterator[0];

  // Read the first byte:
  let byte = dataView.getUint8(iterator[1]++);

  // Get the least significant 6 bits of the value:
  let value = BigInt(byte) & 0b0011_1111n;

  // Get the sign bit:
  const sign = byte & 0b0100_0000;

  // Increase the shift by 6 bits:
  let shift = 6n;

  // While the current byte is a continuation byte:
  while ((byte & 0b1000_0000) !== 0) {
    // Read the byte:
    byte = dataView.getUint8(iterator[1]++);

    // Make the least significant 7 bits of the byte the most significant bits of the value:
    value |= (BigInt(byte) & 0b0111_1111n) << shift;

    // Increase the shift by 7 bits:
    shift += 7n;
  }

  // Apply the sign to the value:
  return sign === 0 ? value : -value;
};

export const readSmallIntv = (iterator: Iterator) => {
  const dataView = iterator[0];

  // Read the first byte:
  let byte = dataView.getUint8(iterator[1]++);

  // Get the least significant 6 bits of the value:
  let value = byte & 0b0011_1111;

  // Get the sign bit:
  const sign = byte & 0b0100_0000;

  // Increase the shift by 6 bits:
  let shift = 6;

  // While the current byte is a continuation byte:
  while ((byte & 0b1000_0000) !== 0) {
    // Read the byte:
    byte = dataView.getUint8(iterator[1]++);

    // Make the least significant 7 bits of the byte the most significant bits of the value:
    value |= (byte & 0b0111_1111) << shift;

    // Increase the shift by 7 bits:
    shift += 7;
  }

  // Apply the sign to the value:
  return sign === 0 ? value : -value;
};

export const readIntv = (iterator: Iterator) => {
  return Number(readBigIntv(iterator));
};

export const writeBigIntv = (iterator: Iterator, value: bigint) => {
  const dataView = iterator[0];

  // Get the sign bit:
  const sign = value < 0 ? 0b0100_0000 : 0;

  // Remove the sign from the value:
  if (sign !== 0) value = -value;

  // Get the least significant 6 bits of the value, as well as the sign bit:
  let byte = Number(value & 0b0011_1111n) | sign;

  // Shift to the next 6 bits of the value:
  value >>= 6n;

  while (true) {
    // If there are remaining bits to write, mark the current byte as a continuation byte:
    if (value !== 0n) byte |= 0b1000_0000;

    // Write the byte:
    dataView.setUint8(iterator[1]++, byte);

    // If there are no remaining bits to write, return:
    if (value === 0n) return;

    // Get the least significant 7 bits of the value:
    byte = Number(value & 0b0111_1111n);

    // Shift to the next 7 bits of the value:
    value >>= 7n;
  }
};

export const writeSmallIntv = (iterator: Iterator, value: number) => {
  const dataView = iterator[0];

  // Get the sign bit:
  const sign = value < 0 ? 0b0100_0000 : 0;

  // Remove the sign from the value:
  if (sign !== 0) value = -value;

  // Get the least significant 6 bits of the value, as well as the sign bit:
  let byte = (value & 0b0011_1111) | sign;

  // Shift to the next 6 bits of the value:
  value >>= 6;

  while (true) {
    // If there are remaining bits to write, mark the current byte as a continuation byte:
    if (value !== 0) byte |= 0b1000_0000;

    // Write the byte:
    dataView.setUint8(iterator[1]++, byte);

    // If there are no remaining bits to write, return:
    if (value === 0) return;

    // Get the least significant 7 bits of the value:
    byte = value & 0b0111_1111;

    // Shift to the next 7 bits of the value:
    value >>= 7;
  }
};

export const writeIntv = (iterator: Iterator, value: bigint | number) => {
  if (typeof value === 'bigint' || Math.abs(value) >= 0x80_00_00_00) {
    writeBigIntv(iterator, BigInt(value));
  } else {
    writeSmallIntv(iterator, value);
  }
};
