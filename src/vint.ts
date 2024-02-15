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
  let value = byte & 63;
  const sign = byte & 64;
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

export const writeBigVsint = (
  dataView: DataView,
  offset: number,
  value: bigint,
) => {
  const sign = value < 0 ? 1 : 0;
  value = sign ? -value : value;

  let byte = Number(value & 63n);
  value >>= 6n;
  if (value !== 0n) byte |= 128;
  if (sign) byte |= 64;
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
  const sign = value < 0 ? 1 : 0;
  value = sign === 1 ? -value : value;

  let byte = value & 63;
  value >>= 6;
  if (value !== 0) byte |= 128;
  if (sign === 1) byte |= 64;
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

export const writeVuint = (
  dataView: DataView,
  offset: number,
  value: bigint | number,
) => {
  return value >= 2_147_483_648
    ? writeBigVuint(dataView, offset, BigInt(value))
    : writeSmallVuint(dataView, offset, Number(value));
};
