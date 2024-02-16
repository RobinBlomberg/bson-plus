export const readBigVsint = (dataView: DataView, offset: number) => {
  let byte = dataView.getUint8(offset++);
  const sign = byte & 64;
  let value = BigInt(byte & 63);

  if (byte & 128) {
    let shift = 6n;
    while (true) {
      byte = dataView.getUint8(offset++);
      value |= BigInt(byte & 127) << shift;
      if ((byte & 128) === 0) break;
      shift += 7n;
    }
  }

  return sign === 0 ? value : -value;
};

export const readBigVuint = (dataView: DataView, offset: number) => {
  let value = 0n;
  let shift = 0n;
  while (true) {
    const byte = dataView.getUint8(offset++);
    value |= BigInt(byte & 127) << shift;
    if ((byte & 128) === 0) break;
    shift += 7n;
  }
  return value;
};

export const readSmallVsint = (dataView: DataView, offset: number) => {
  let byte = dataView.getUint8(offset++);
  const sign = byte & 64;
  let value = byte & 63;

  if (byte & 128) {
    let shift = 6;
    while (true) {
      byte = dataView.getUint8(offset++);
      value |= (byte & 127) << shift;
      if ((byte & 128) === 0) break;
      shift += 7;
    }
  }

  return sign === 0 ? value : -value;
};

export const readSmallVuint = (dataView: DataView, offset: number) => {
  let value = 0;
  let shift = 0;
  while (true) {
    const byte = dataView.getUint8(offset++);
    value |= (byte & 127) << shift;
    if ((byte & 128) === 0) break;
    shift += 7;
  }
  return value;
};

export const readVsint = readBigVsint;

export const readVuint = readBigVuint;

export const writeBigVsint = (
  dataView: DataView,
  offset: number,
  value: bigint,
) => {
  const sign = value < 0 ? 64 : 0;
  if (sign !== 0) value = -value;
  let byte = sign | Number(value & 63n);
  value >>= 6n;
  if (value !== 0n) byte |= 128;
  dataView.setUint8(offset++, byte);

  while (value !== 0n) {
    byte = Number(value & 127n);
    value >>= 7n;
    if (value !== 0n) byte |= 128;
    dataView.setUint8(offset++, byte);
  }
  return offset;
};

export const writeBigVuint = (
  dataView: DataView,
  offset: number,
  value: bigint,
) => {
  do {
    let byte = Number(value & 127n);
    value >>= 7n;
    if (value !== 0n) byte |= 128;
    dataView.setUint8(offset++, byte);
  } while (value !== 0n);
  return offset;
};

export const writeSmallVsint = (
  dataView: DataView,
  offset: number,
  value: number,
) => {
  const sign = value < 0 ? 64 : 0;
  if (sign !== 0) value = -value;
  let byte = sign | (value & 63);
  value >>= 6;
  if (value !== 0) byte |= 128;
  dataView.setUint8(offset++, byte);

  while (value !== 0) {
    byte = value & 127;
    value >>= 7;
    if (value !== 0) byte |= 128;
    dataView.setUint8(offset++, byte);
  }
  return offset;
};

export const writeSmallVuint = (
  dataView: DataView,
  offset: number,
  value: number,
) => {
  do {
    let byte = value & 127;
    value >>= 7;
    if (value !== 0) byte |= 128;
    dataView.setUint8(offset++, byte);
  } while (value !== 0);
  return offset;
};

export const writeVsint = (
  dataView: DataView,
  offset: number,
  value: bigint | number,
) => {
  return value >= 0x80_00_00_00 || value <= -0x80_00_00_00
    ? writeBigVsint(dataView, offset, BigInt(value))
    : writeSmallVsint(dataView, offset, Number(value));
};

export const writeVuint = (
  dataView: DataView,
  offset: number,
  value: bigint | number,
) => {
  return value >= 0x80_00_00_00
    ? writeBigVuint(dataView, offset, BigInt(value))
    : writeSmallVuint(dataView, offset, Number(value));
};
