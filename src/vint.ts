import type { DataViewIterator } from './data-view-iterator.js';

export const readBigVsint = (iterator: DataViewIterator) => {
  const dataView = iterator[0];
  let byte = dataView.getUint8(iterator[1]++);
  const sign = byte & 64;
  let value = BigInt(byte & 63);

  if (byte & 128) {
    let shift = 6n;
    while (true) {
      byte = dataView.getUint8(iterator[1]++);
      value |= BigInt(byte & 127) << shift;
      if ((byte & 128) === 0) break;
      shift += 7n;
    }
  }

  return sign === 0 ? value : -value;
};

export const readBigVuint = (iterator: DataViewIterator) => {
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

export const readSmallVsint = (iterator: DataViewIterator) => {
  const dataView = iterator[0];
  let byte = dataView.getUint8(iterator[1]++);
  const sign = byte & 64;
  let value = byte & 63;

  if (byte & 128) {
    let shift = 6;
    while (true) {
      byte = dataView.getUint8(iterator[1]++);
      value |= (byte & 127) << shift;
      if ((byte & 128) === 0) break;
      shift += 7;
    }
  }

  return sign === 0 ? value : -value;
};

export const readSmallVuint = (iterator: DataViewIterator) => {
  const dataView = iterator[0];
  let value = 0;
  let shift = 0;
  while (true) {
    const byte = dataView.getUint8(iterator[1]++);
    value |= (byte & 127) << shift;
    if ((byte & 128) === 0) break;
    shift += 7;
  }
  return value;
};

export const readVsint = readBigVsint;

export const readVuint = readBigVuint;

export const writeBigVsint = (iterator: DataViewIterator, value: bigint) => {
  const dataView = iterator[0];
  const sign = value < 0 ? 64 : 0;
  if (sign !== 0) value = -value;
  let byte = sign | Number(value & 63n);
  value >>= 6n;
  if (value !== 0n) byte |= 128;
  dataView.setUint8(iterator[1]++, byte);

  while (value !== 0n) {
    byte = Number(value & 127n);
    value >>= 7n;
    if (value !== 0n) byte |= 128;
    dataView.setUint8(iterator[1]++, byte);
  }
  return iterator[1];
};

export const writeBigVuint = (iterator: DataViewIterator, value: bigint) => {
  const dataView = iterator[0];
  do {
    let byte = Number(value & 127n);
    value >>= 7n;
    if (value !== 0n) byte |= 128;
    dataView.setUint8(iterator[1]++, byte);
  } while (value !== 0n);
  return iterator[1];
};

export const writeSmallVsint = (iterator: DataViewIterator, value: number) => {
  const dataView = iterator[0];
  const sign = value < 0 ? 64 : 0;
  if (sign !== 0) value = -value;
  let byte = sign | (value & 63);
  value >>= 6;
  if (value !== 0) byte |= 128;
  dataView.setUint8(iterator[1]++, byte);

  while (value !== 0) {
    byte = value & 127;
    value >>= 7;
    if (value !== 0) byte |= 128;
    dataView.setUint8(iterator[1]++, byte);
  }
  return iterator[1];
};

export const writeSmallVuint = (iterator: DataViewIterator, value: number) => {
  const dataView = iterator[0];
  do {
    let byte = value & 127;
    value >>= 7;
    if (value !== 0) byte |= 128;
    dataView.setUint8(iterator[1]++, byte);
  } while (value !== 0);
  return iterator[1];
};

export const writeVsint = (
  iterator: DataViewIterator,
  value: bigint | number,
) => {
  return value >= 0x80_00_00_00 || value <= -0x80_00_00_00
    ? writeBigVsint(iterator, BigInt(value))
    : writeSmallVsint(iterator, Number(value));
};

export const writeVuint = (
  iterator: DataViewIterator,
  value: bigint | number,
) => {
  return value >= 0x80_00_00_00
    ? writeBigVuint(iterator, BigInt(value))
    : writeSmallVuint(iterator, Number(value));
};
